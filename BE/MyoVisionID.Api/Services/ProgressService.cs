using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Progress;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class ProgressService : IProgressService
{
    private readonly AppDbContext _context;
    private readonly IClinicScopeService _clinicScope;
    private readonly ICurrentUserService _currentUser;

    public ProgressService(
        AppDbContext context,
        IClinicScopeService clinicScope,
        ICurrentUserService currentUser)
    {
        _context = context;
        _clinicScope = clinicScope;
        _currentUser = currentUser;
    }

    public async Task<List<FollowUpDto>> GetFollowUpsAsync(long patientId)
    {
        await EnsurePatientAccessAsync(patientId);

        return await _context.FollowUpRecords
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(x => x.FollowUpDate)
            .Select(x => MapFollowUp(x))
            .ToListAsync();
    }

    public async Task<FollowUpDto> CreateFollowUpAsync(long patientId, CreateFollowUpDto request)
    {
        await EnsurePatientAccessAsync(patientId);

        if (request.VisitId.HasValue)
            await EnsureVisitBelongsToPatientAsync(patientId, request.VisitId.Value);

        if (request.TreatmentPlanId.HasValue)
            await EnsureTreatmentPlanBelongsToPatientAsync(patientId, request.TreatmentPlanId.Value);

        var entity = new FollowUpRecord
        {
            PatientId = patientId,
            VisitId = request.VisitId,
            TreatmentPlanId = request.TreatmentPlanId,
            FollowUpDate = request.FollowUpDate,
            ComplianceLevel = request.ComplianceLevel,
            SideEffects = request.SideEffects,
            ParentFeedback = request.ParentFeedback,
            DoctorNote = request.DoctorNote,
            NextFollowUpDate = request.NextFollowUpDate,
            CreatedBy = _currentUser.UserId,
            CreatedAt = DateTime.UtcNow
        };

        _context.FollowUpRecords.Add(entity);
        await _context.SaveChangesAsync();

        return MapFollowUp(entity);
    }

    public async Task<List<ProgressSnapshotDto>> GetProgressSnapshotsAsync(long patientId)
    {
        await EnsurePatientAccessAsync(patientId);

        return await _context.ProgressSnapshots
            .Where(x => x.PatientId == patientId)
            .OrderBy(x => x.SnapshotDate)
            .Select(x => MapSnapshot(x))
            .ToListAsync();
    }

    public async Task<ProgressSnapshotDto> GenerateSnapshotAsync(long patientId, long visitId)
    {
        await EnsurePatientAccessAsync(patientId);
        await EnsureVisitBelongsToPatientAsync(patientId, visitId);

        var existed = await _context.ProgressSnapshots
            .FirstOrDefaultAsync(x => x.PatientId == patientId && x.VisitId == visitId);

        if (existed != null)
            return MapSnapshot(existed);

        var visit = await _context.Visits.FirstAsync(x => x.VisitId == visitId);

        var refractions = await _context.EyeRefractions
            .Where(x => x.VisitId == visitId)
            .ToListAsync();

        var biometrics = await _context.EyeBiometrics
            .Where(x => x.VisitId == visitId)
            .ToListAsync();

        var odRef = refractions.FirstOrDefault(x => x.EyeSide == "OD");
        var osRef = refractions.FirstOrDefault(x => x.EyeSide == "OS");
        var odBio = biometrics.FirstOrDefault(x => x.EyeSide == "OD");
        var osBio = biometrics.FirstOrDefault(x => x.EyeSide == "OS");

        var previous = await _context.ProgressSnapshots
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(x => x.SnapshotDate)
            .FirstOrDefaultAsync();

        var snapshot = new ProgressSnapshot
        {
            PatientId = patientId,
            VisitId = visitId,
            SnapshotDate = DateOnly.FromDateTime(visit.VisitDate),
            SerOd = odRef?.Ser,
            SerOs = osRef?.Ser,
            AxialLengthOd = odBio?.AxialLengthMm,
            AxialLengthOs = osBio?.AxialLengthMm,
            VaOd = odRef?.Va,
            VaOs = osRef?.Va,
            IopOd = odBio?.IopMmhg,
            IopOs = osBio?.IopMmhg,
            AlGrowthOd = previous == null ? null : odBio?.AxialLengthMm - previous.AxialLengthOd,
            AlGrowthOs = previous == null ? null : osBio?.AxialLengthMm - previous.AxialLengthOs,
            SerChangeOd = previous == null ? null : odRef?.Ser - previous.SerOd,
            SerChangeOs = previous == null ? null : osRef?.Ser - previous.SerOs,
            ProgressionNote = BuildProgressionNote(odRef?.Ser, osRef?.Ser, odBio?.AxialLengthMm, osBio?.AxialLengthMm),
            CreatedAt = DateTime.UtcNow
        };

        _context.ProgressSnapshots.Add(snapshot);
        await _context.SaveChangesAsync();

        return MapSnapshot(snapshot);
    }

    public async Task<object> GetProgressChartAsync(long patientId)
    {
        await EnsurePatientAccessAsync(patientId);

        var snapshots = await _context.ProgressSnapshots
            .Where(x => x.PatientId == patientId)
            .OrderBy(x => x.SnapshotDate)
            .Select(x => MapSnapshot(x))
            .ToListAsync();

        return new
        {
            PatientId = patientId,
            Items = snapshots,
            Chart = snapshots.Select(x => new
            {
                Date = x.SnapshotDate,
                x.SerOd,
                x.SerOs,
                x.AxialLengthOd,
                x.AxialLengthOs
            })
        };
    }

    public async Task<object> CompareVisitsAsync(long patientId, long fromVisitId, long toVisitId)
    {
        await EnsurePatientAccessAsync(patientId);
        await EnsureVisitBelongsToPatientAsync(patientId, fromVisitId);
        await EnsureVisitBelongsToPatientAsync(patientId, toVisitId);

        var from = await _context.ProgressSnapshots
            .FirstOrDefaultAsync(x => x.PatientId == patientId && x.VisitId == fromVisitId);

        var to = await _context.ProgressSnapshots
            .FirstOrDefaultAsync(x => x.PatientId == patientId && x.VisitId == toVisitId);

        if (from == null)
            from = await CreateSnapshotEntityAsync(patientId, fromVisitId);

        if (to == null)
            to = await CreateSnapshotEntityAsync(patientId, toVisitId);

        return new
        {
            PatientId = patientId,
            From = MapSnapshot(from),
            To = MapSnapshot(to),
            Difference = new
            {
                AlGrowthOd = to.AxialLengthOd - from.AxialLengthOd,
                AlGrowthOs = to.AxialLengthOs - from.AxialLengthOs,
                SerChangeOd = to.SerOd - from.SerOd,
                SerChangeOs = to.SerOs - from.SerOs
            }
        };
    }

    private async Task<ProgressSnapshot> CreateSnapshotEntityAsync(long patientId, long visitId)
    {
        var dto = await GenerateSnapshotAsync(patientId, visitId);
        return await _context.ProgressSnapshots.FirstAsync(x => x.ProgressSnapshotId == dto.ProgressSnapshotId);
    }

    private async Task EnsurePatientAccessAsync(long patientId)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(x => x.PatientId == patientId);

        if (patient == null)
            throw new KeyNotFoundException("Patient not found.");

        if (patient.ClinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(patient.ClinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");
    }

    private async Task EnsureVisitBelongsToPatientAsync(long patientId, long visitId)
    {
        var exists = await _context.Visits.AnyAsync(x => x.VisitId == visitId && x.PatientId == patientId);

        if (!exists)
            throw new InvalidOperationException("Visit does not belong to this patient.");
    }

    private async Task EnsureTreatmentPlanBelongsToPatientAsync(long patientId, long treatmentPlanId)
    {
        var exists = await _context.TreatmentPlans.AnyAsync(x =>
            x.TreatmentPlanId == treatmentPlanId &&
            x.PatientId == patientId);

        if (!exists)
            throw new InvalidOperationException("Treatment plan does not belong to this patient.");
    }

    private static string BuildProgressionNote(decimal? serOd, decimal? serOs, decimal? alOd, decimal? alOs)
    {
        if ((serOd <= -6 || serOs <= -6) || (alOd >= 26 || alOs >= 26))
            return "High myopia progression risk. Close monitoring is recommended.";

        if ((serOd <= -3 || serOs <= -3) || (alOd >= 24.5m || alOs >= 24.5m))
            return "Moderate progression risk. Continue treatment monitoring.";

        return "Stable or low progression based on current snapshot.";
    }

    private static FollowUpDto MapFollowUp(FollowUpRecord x)
    {
        return new FollowUpDto
        {
            FollowUpId = x.FollowUpId,
            PatientId = x.PatientId,
            VisitId = x.VisitId,
            TreatmentPlanId = x.TreatmentPlanId,
            FollowUpDate = x.FollowUpDate,
            ComplianceLevel = x.ComplianceLevel,
            SideEffects = x.SideEffects,
            ParentFeedback = x.ParentFeedback,
            DoctorNote = x.DoctorNote,
            NextFollowUpDate = x.NextFollowUpDate,
            CreatedBy = x.CreatedBy,
            CreatedAt = x.CreatedAt
        };
    }

    private static ProgressSnapshotDto MapSnapshot(ProgressSnapshot x)
    {
        return new ProgressSnapshotDto
        {
            ProgressSnapshotId = x.ProgressSnapshotId,
            PatientId = x.PatientId,
            VisitId = x.VisitId,
            SnapshotDate = x.SnapshotDate,
            SerOd = x.SerOd,
            SerOs = x.SerOs,
            AxialLengthOd = x.AxialLengthOd,
            AxialLengthOs = x.AxialLengthOs,
            VaOd = x.VaOd,
            VaOs = x.VaOs,
            IopOd = x.IopOd,
            IopOs = x.IopOs,
            AlGrowthOd = x.AlGrowthOd,
            AlGrowthOs = x.AlGrowthOs,
            SerChangeOd = x.SerChangeOd,
            SerChangeOs = x.SerChangeOs,
            ProgressionNote = x.ProgressionNote,
            CreatedAt = x.CreatedAt
        };
    }
}
