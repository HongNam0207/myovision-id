using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.DoctorCore;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class DoctorCoreService : IDoctorCoreService
{
    private readonly AppDbContext _context;
    private readonly IClinicScopeService _clinicScope;
    private readonly ICurrentUserService _currentUser;

    public DoctorCoreService(AppDbContext context, IClinicScopeService clinicScope, ICurrentUserService currentUser)
    {
        _context = context;
        _clinicScope = clinicScope;
        _currentUser = currentUser;
    }

    public async Task<object> GetVisitFullRecordAsync(long visitId)
    {
        var visit = await GetVisitAsync(visitId);

        return new
        {
            Visit = visit,
            Patient = await _context.Patients.FirstOrDefaultAsync(x => x.PatientId == visit.PatientId),
            ClinicalIntake = await _context.ClinicalIntakes.FirstOrDefaultAsync(x => x.VisitId == visitId),
            Refractions = await _context.EyeRefractions.Where(x => x.VisitId == visitId).ToListAsync(),
            Biometrics = await _context.EyeBiometrics.Where(x => x.VisitId == visitId).ToListAsync(),
            BinocularVision = await _context.BinocularVisions.FirstOrDefaultAsync(x => x.VisitId == visitId),
            RiskAssessment = await _context.RiskAssessments.FirstOrDefaultAsync(x => x.VisitId == visitId),
            Diagnosis = await _context.DoctorDiagnoses.FirstOrDefaultAsync(x => x.VisitId == visitId),
            DoctorNotes = await _context.DoctorNotes.Where(x => x.VisitId == visitId).ToListAsync()
        };
    }

    public async Task<RiskAssessmentDto?> GetRiskAssessmentAsync(long visitId)
    {
        await GetVisitAsync(visitId);
        var entity = await _context.RiskAssessments.FirstOrDefaultAsync(x => x.VisitId == visitId);
        return entity == null ? null : MapRisk(entity);
    }

    public async Task<RiskAssessmentDto> CalculateRiskAssessmentAsync(long visitId, CalculateRiskAssessmentDto request)
    {
        var visit = await GetVisitAsync(visitId);

        if (visit.Status != "WAITING_DOCTOR" && visit.Status != "IN_DIAGNOSIS" && visit.Status != "WAITING_APPROVAL")
            throw new InvalidOperationException("Visit must be in doctor workflow.");

        var patient = await _context.Patients.FirstAsync(x => x.PatientId == visit.PatientId);
        var intake = await _context.ClinicalIntakes.FirstOrDefaultAsync(x => x.VisitId == visitId);
        var biometrics = await _context.EyeBiometrics.Where(x => x.VisitId == visitId).ToListAsync();
        var refractions = await _context.EyeRefractions.Where(x => x.VisitId == visitId).ToListAsync();

        decimal score = 0;
        var age = CalculateAge(patient.DateOfBirth);

        if (age <= 8) score += 25;
        else if (age <= 12) score += 15;
        else score += 5;

        if (intake?.FatherHasMyopia == true) score += 10;
        if (intake?.MotherHasMyopia == true) score += 10;
        if (intake?.SiblingHasMyopia == true) score += 5;
        if (intake?.NearWorkHoursPerDay >= 4) score += 15;
        if (intake?.ScreenTimeHoursPerDay >= 3) score += 10;
        if (intake?.OutdoorHoursPerDay < 1) score += 15;

        var maxAlCr = biometrics.Where(x => x.AlCrRatio.HasValue).Select(x => x.AlCrRatio!.Value).DefaultIfEmpty(0).Max();
        var minSer = refractions.Where(x => x.Ser.HasValue).Select(x => x.Ser!.Value).DefaultIfEmpty(0).Min();

        var alCrWarning = maxAlCr >= 3.0m;
        var progressionWarning = minSer <= -3.00m;

        if (alCrWarning) score += 15;
        if (progressionWarning) score += 10;

        var riskLevel = score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";

        var entity = await _context.RiskAssessments.FirstOrDefaultAsync(x => x.VisitId == visitId);

        if (entity == null)
        {
            entity = new RiskAssessment
            {
                VisitId = visit.VisitId,
                PatientId = visit.PatientId,
                RiskModelId = request.RiskModelId,
                AssessedBy = _currentUser.UserId,
                AssessedAt = DateTime.UtcNow.AddHours(7)
            };
            _context.RiskAssessments.Add(entity);
        }

        entity.TotalScore = score;
        entity.RiskLevel = riskLevel;
        entity.AlCrWarning = alCrWarning;
        entity.ProgressionWarning = progressionWarning;
        entity.Recommendation = request.Recommendation ?? BuildRecommendation(riskLevel);

        await _context.SaveChangesAsync();
        return MapRisk(entity);
    }

    public async Task<DiagnosisDto?> GetDiagnosisAsync(long visitId)
    {
        await GetVisitAsync(visitId);
        var entity = await _context.DoctorDiagnoses.FirstOrDefaultAsync(x => x.VisitId == visitId);
        return entity == null ? null : MapDiagnosis(entity);
    }

    public async Task<DiagnosisDto> UpsertDiagnosisAsync(long visitId, UpsertDiagnosisDto request)
    {
        var visit = await GetVisitAsync(visitId);

        if (visit.Status != "WAITING_DOCTOR" && visit.Status != "IN_DIAGNOSIS" && visit.Status != "WAITING_APPROVAL")
            throw new InvalidOperationException("Visit must be in doctor workflow.");

        var entity = await _context.DoctorDiagnoses.FirstOrDefaultAsync(x => x.VisitId == visitId);

        if (entity == null)
        {
            entity = new DoctorDiagnosis
            {
                VisitId = visit.VisitId,
                PatientId = visit.PatientId,
                DoctorId = _currentUser.UserId,
                CreatedAt = DateTime.UtcNow.AddHours(7)
            };

            _context.DoctorDiagnoses.Add(entity);
        }

        entity.DiagnosisCode = request.DiagnosisCode;
        entity.DiagnosisName = request.DiagnosisName;
        entity.ClinicalConclusion = request.ClinicalConclusion;
        entity.MyopiaType = request.MyopiaType;
        entity.SeverityLevel = request.SeverityLevel;
        entity.ProgressionStatus = request.ProgressionStatus;
        entity.UpdatedAt = DateTime.UtcNow.AddHours(7);

        await _context.SaveChangesAsync();

        return MapDiagnosis(entity);
    }

    public async Task<List<DiagnosisDto>> GetDiagnosisHistoryAsync(long patientId)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(x => x.PatientId == patientId);

        if (patient == null)
            throw new KeyNotFoundException("Patient not found.");

        if (patient.ClinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(patient.ClinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        return await _context.DoctorDiagnoses
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => MapDiagnosis(x))
            .ToListAsync();
    }

    public async Task<List<DoctorNoteDto>> GetDoctorNotesAsync(long visitId)
    {
        await GetVisitAsync(visitId);

        return await _context.DoctorNotes
            .Where(x => x.VisitId == visitId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => MapDoctorNote(x))
            .ToListAsync();
    }

    public async Task<DoctorNoteDto> CreateDoctorNoteAsync(long visitId, CreateDoctorNoteDto request)
    {
        var visit = await GetVisitAsync(visitId);

        if (visit.Status != "WAITING_DOCTOR" && visit.Status != "IN_DIAGNOSIS" && visit.Status != "WAITING_APPROVAL")
            throw new InvalidOperationException("Visit must be in doctor workflow.");

        if (string.IsNullOrWhiteSpace(request.NoteContent))
            throw new InvalidOperationException("NoteContent is required.");

        var entity = new DoctorNote
        {
            VisitId = visit.VisitId,
            PatientId = visit.PatientId,
            DoctorId = _currentUser.UserId,
            NoteType = string.IsNullOrWhiteSpace(request.NoteType) ? "CLINICAL" : request.NoteType,
            NoteContent = request.NoteContent,
            IsInternal = request.IsInternal,
            CreatedAt = DateTime.UtcNow.AddHours(7)
        };

        _context.DoctorNotes.Add(entity);
        await _context.SaveChangesAsync();

        return MapDoctorNote(entity);
    }

    private async Task<Visit> GetVisitAsync(long visitId)
    {
        var visit = await _context.Visits.FirstOrDefaultAsync(x => x.VisitId == visitId);

        if (visit == null)
            throw new KeyNotFoundException("Visit not found.");

        if (visit.ClinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(visit.ClinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        return visit;
    }

    private static int CalculateAge(DateOnly dateOfBirth)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(7));
        var age = today.Year - dateOfBirth.Year;

        if (dateOfBirth > today.AddYears(-age))
            age--;

        return age;
    }

    private static string BuildRecommendation(string riskLevel)
    {
        return riskLevel switch
        {
            "HIGH" => "High risk. Doctor should consider intensive myopia control and close follow-up.",
            "MEDIUM" => "Medium risk. Doctor should monitor progression and consider myopia control intervention.",
            _ => "Low risk. Continue monitoring and lifestyle guidance."
        };
    }

    private static RiskAssessmentDto MapRisk(RiskAssessment x)
    {
        return new RiskAssessmentDto
        {
            RiskAssessmentId = x.RiskAssessmentId,
            VisitId = x.VisitId,
            PatientId = x.PatientId,
            RiskModelId = x.RiskModelId,
            TotalScore = x.TotalScore,
            RiskLevel = x.RiskLevel,
            AlCrWarning = x.AlCrWarning ?? false,
            ProgressionWarning = x.ProgressionWarning ?? false,
            Recommendation = x.Recommendation,
            AssessedBy = x.AssessedBy,
            AssessedAt = x.AssessedAt
        };
    }

    private static DiagnosisDto MapDiagnosis(DoctorDiagnosis x)
    {
        return new DiagnosisDto
        {
            DiagnosisId = x.DiagnosisId,
            VisitId = x.VisitId,
            PatientId = x.PatientId,
            DoctorId = x.DoctorId,
            DiagnosisCode = x.DiagnosisCode,
            DiagnosisName = x.DiagnosisName,
            ClinicalConclusion = x.ClinicalConclusion,
            MyopiaType = x.MyopiaType,
            SeverityLevel = x.SeverityLevel,
            ProgressionStatus = x.ProgressionStatus,
            CreatedAt = x.CreatedAt,
            UpdatedAt = x.UpdatedAt
        };
    }

    private static DoctorNoteDto MapDoctorNote(DoctorNote x)
    {
        return new DoctorNoteDto
        {
            DoctorNoteId = x.DoctorNoteId,
            VisitId = x.VisitId,
            PatientId = x.PatientId,
            DoctorId = x.DoctorId,
            NoteType = x.NoteType,
            NoteContent = x.NoteContent,
            IsInternal = x.IsInternal ?? true,
            CreatedAt = x.CreatedAt
        };
    }
}


