using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.ClinicalIntakes;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class ClinicalIntakeService : IClinicalIntakeService
{
    private readonly AppDbContext _context;
    private readonly IClinicScopeService _clinicScope;
    private readonly ICurrentUserService _currentUser;

    public ClinicalIntakeService(
        AppDbContext context,
        IClinicScopeService clinicScope,
        ICurrentUserService currentUser)
    {
        _context = context;
        _clinicScope = clinicScope;
        _currentUser = currentUser;
    }

    public async Task<ClinicalIntakeDto?> GetByVisitIdAsync(long visitId)
    {
        var visit = await GetVisitWithAccessCheckAsync(visitId);

        var intake = await _context.ClinicalIntakes
            .Include(x => x.EnteredByNavigation)
            .FirstOrDefaultAsync(x => x.VisitId == visit.VisitId);

        return intake == null ? null : Map(intake);
    }

    public async Task<ClinicalIntakeDto> CreateAsync(long visitId, UpsertClinicalIntakeDto request)
    {
        var visit = await GetVisitWithAccessCheckAsync(visitId);

        if (await _context.ClinicalIntakes.AnyAsync(x => x.VisitId == visitId))
            throw new InvalidOperationException("Clinical intake already exists for this visit.");

        if (visit.Status != "IN_INTAKE" && visit.Status != "WAITING_INTAKE")
            throw new InvalidOperationException("Visit must be in WAITING_INTAKE or IN_INTAKE status to create clinical intake.");

        ValidateRequest(request);

        var intake = new ClinicalIntake
        {
            VisitId = visit.VisitId,
            PatientId = visit.PatientId,
            EnteredBy = _currentUser.UserId,
            CreatedAt = DateTime.UtcNow.AddHours(7)
        };

        Apply(intake, request);

        _context.ClinicalIntakes.Add(intake);
        await _context.SaveChangesAsync();

        return await GetRequiredDtoByIdAsync(intake.IntakeId);
    }

    public async Task<ClinicalIntakeDto> UpdateAsync(long intakeId, UpsertClinicalIntakeDto request)
    {
        var intake = await _context.ClinicalIntakes
            .Include(x => x.Visit)
            .FirstOrDefaultAsync(x => x.IntakeId == intakeId);

        if (intake == null)
            throw new KeyNotFoundException("Clinical intake not found.");

        if (intake.Visit.ClinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(intake.Visit.ClinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        if (intake.Visit.Status == "COMPLETED" || intake.Visit.Status == "CANCELLED")
            throw new InvalidOperationException("Cannot update intake of completed or cancelled visit.");

        ValidateRequest(request);

        Apply(intake, request);
        intake.UpdatedAt = DateTime.UtcNow.AddHours(7);

        await _context.SaveChangesAsync();

        return await GetRequiredDtoByIdAsync(intake.IntakeId);
    }

    private async Task<Visit> GetVisitWithAccessCheckAsync(long visitId)
    {
        var visit = await _context.Visits.FirstOrDefaultAsync(x => x.VisitId == visitId);

        if (visit == null)
            throw new KeyNotFoundException("Visit not found.");

        if (visit.ClinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(visit.ClinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        return visit;
    }

    private async Task<ClinicalIntakeDto> GetRequiredDtoByIdAsync(long intakeId)
    {
        var intake = await _context.ClinicalIntakes
            .Include(x => x.EnteredByNavigation)
            .FirstOrDefaultAsync(x => x.IntakeId == intakeId);

        if (intake == null)
            throw new KeyNotFoundException("Clinical intake not found.");

        return Map(intake);
    }

    private static void ValidateRequest(UpsertClinicalIntakeDto request)
    {
        if (request.HeightCm is < 30 or > 250)
            throw new InvalidOperationException("HeightCm must be between 30 and 250.");

        if (request.WeightKg is < 1 or > 300)
            throw new InvalidOperationException("WeightKg must be between 1 and 300.");

        if (request.AgeMyopiaDetected is < 0 or > 30)
            throw new InvalidOperationException("AgeMyopiaDetected must be between 0 and 30.");

        if (request.NearWorkHoursPerDay is < 0 or > 24)
            throw new InvalidOperationException("NearWorkHoursPerDay must be between 0 and 24.");

        if (request.OutdoorHoursPerDay is < 0 or > 24)
            throw new InvalidOperationException("OutdoorHoursPerDay must be between 0 and 24.");

        if (request.ScreenTimeHoursPerDay is < 0 or > 24)
            throw new InvalidOperationException("ScreenTimeHoursPerDay must be between 0 and 24.");

        if (request.ReadingDistanceCm is < 5 or > 200)
            throw new InvalidOperationException("ReadingDistanceCm must be between 5 and 200.");
    }

    private static void Apply(ClinicalIntake intake, UpsertClinicalIntakeDto request)
    {
        intake.HeightCm = request.HeightCm;
        intake.WeightKg = request.WeightKg;
        intake.BloodPressure = request.BloodPressure;
        intake.ReasonForVisit = request.ReasonForVisit;
        intake.AgeMyopiaDetected = request.AgeMyopiaDetected;
        intake.CurrentGlassesPower = request.CurrentGlassesPower;
        intake.PreviousTreatment = request.PreviousTreatment;
        intake.FatherHasMyopia = request.FatherHasMyopia;
        intake.MotherHasMyopia = request.MotherHasMyopia;
        intake.SiblingHasMyopia = request.SiblingHasMyopia;
        intake.FamilyHistoryNote = request.FamilyHistoryNote;
        intake.NearWorkHoursPerDay = request.NearWorkHoursPerDay;
        intake.OutdoorHoursPerDay = request.OutdoorHoursPerDay;
        intake.ScreenTimeHoursPerDay = request.ScreenTimeHoursPerDay;
        intake.ReadingDistanceCm = request.ReadingDistanceCm;
        intake.AllergyHistory = request.AllergyHistory;
        intake.SystemicDiseaseHistory = request.SystemicDiseaseHistory;
        intake.EyeDiseaseHistory = request.EyeDiseaseHistory;
    }

    private static ClinicalIntakeDto Map(ClinicalIntake intake)
    {
        return new ClinicalIntakeDto
        {
            IntakeId = intake.IntakeId,
            VisitId = intake.VisitId,
            PatientId = intake.PatientId,
            HeightCm = intake.HeightCm,
            WeightKg = intake.WeightKg,
            BloodPressure = intake.BloodPressure,
            ReasonForVisit = intake.ReasonForVisit,
            AgeMyopiaDetected = intake.AgeMyopiaDetected,
            CurrentGlassesPower = intake.CurrentGlassesPower,
            PreviousTreatment = intake.PreviousTreatment,
            FatherHasMyopia = intake.FatherHasMyopia,
            MotherHasMyopia = intake.MotherHasMyopia,
            SiblingHasMyopia = intake.SiblingHasMyopia,
            FamilyHistoryNote = intake.FamilyHistoryNote,
            NearWorkHoursPerDay = intake.NearWorkHoursPerDay,
            OutdoorHoursPerDay = intake.OutdoorHoursPerDay,
            ScreenTimeHoursPerDay = intake.ScreenTimeHoursPerDay,
            ReadingDistanceCm = intake.ReadingDistanceCm,
            AllergyHistory = intake.AllergyHistory,
            SystemicDiseaseHistory = intake.SystemicDiseaseHistory,
            EyeDiseaseHistory = intake.EyeDiseaseHistory,
            EnteredBy = intake.EnteredBy,
            EnteredByName = intake.EnteredByNavigation != null ? intake.EnteredByNavigation.FullName : null,
            CreatedAt = intake.CreatedAt,
            UpdatedAt = intake.UpdatedAt
        };
    }
}

