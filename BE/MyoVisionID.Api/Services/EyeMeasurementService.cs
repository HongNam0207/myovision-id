using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Measurements;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class EyeMeasurementService : IEyeMeasurementService
{
    private readonly AppDbContext _context;
    private readonly IClinicScopeService _clinicScope;
    private readonly ICurrentUserService _currentUser;
    private readonly IVisitService _visitService;

    public EyeMeasurementService(
        AppDbContext context,
        IClinicScopeService clinicScope,
        ICurrentUserService currentUser,
        IVisitService visitService)
    {
        _context = context;
        _clinicScope = clinicScope;
        _currentUser = currentUser;
        _visitService = visitService;
    }

    public async Task<List<EyeRefractionDto>> GetRefractionsAsync(long visitId)
    {
        var visit = await GetVisitAsync(visitId);

        return await _context.EyeRefractions
            .Where(x => x.VisitId == visit.VisitId)
            .Select(x => new EyeRefractionDto
            {
                RefractionId = x.RefractionId,
                VisitId = x.VisitId,
                PatientId = x.PatientId,
                EyeSide = x.EyeSide,
                MeasurementType = x.MeasurementType,
                Sph = x.Sph,
                Cyl = x.Cyl,
                AxisDegree = x.AxisDegree,
                Va = x.Va,
                Bcva = x.Bcva,
                Ser = x.Ser,
                Note = x.Note
            })
            .ToListAsync();
    }

    public async Task<EyeRefractionDto> CreateRefractionAsync(long visitId, CreateEyeRefractionDto request)
    {
        var visit = await GetVisitAsync(visitId);
        EnsureMeasurementStatus(visit);

        if (request.EyeSide != "OD" && request.EyeSide != "OS")
            throw new InvalidOperationException("EyeSide must be OD or OS.");

        if (request.AxisDegree is < 0 or > 180)
            throw new InvalidOperationException("AxisDegree must be between 0 and 180.");

        var entity = new EyeRefraction
        {
            VisitId = visit.VisitId,
            PatientId = visit.PatientId,
            EyeSide = request.EyeSide,
            MeasurementType = request.MeasurementType,
            Sph = request.Sph,
            Cyl = request.Cyl,
            AxisDegree = request.AxisDegree,
            Va = request.Va,
            Bcva = request.Bcva,
            Note = request.Note,
            MeasuredBy = _currentUser.UserId,
            MeasuredAt = DateTime.UtcNow.AddHours(7)
        };

        _context.EyeRefractions.Add(entity);
        await _context.SaveChangesAsync();

        entity = await _context.EyeRefractions.FirstAsync(x => x.RefractionId == entity.RefractionId);

        return MapRefraction(entity);
    }

    public async Task<List<EyeBiometricDto>> GetBiometricsAsync(long visitId)
    {
        var visit = await GetVisitAsync(visitId);

        return await _context.EyeBiometrics
            .Where(x => x.VisitId == visit.VisitId)
            .Select(x => new EyeBiometricDto
            {
                BiometricId = x.BiometricId,
                VisitId = x.VisitId,
                PatientId = x.PatientId,
                EyeSide = x.EyeSide,
                AxialLengthMm = x.AxialLengthMm,
                K1 = x.K1,
                K2 = x.K2,
                Kmax = x.Kmax,
                PachymetryUm = x.PachymetryUm,
                PupilSizeMm = x.PupilSizeMm,
                TbutSeconds = x.TbutSeconds,
                IopMmhg = x.IopMmhg,
                CornealRadiusMm = x.CornealRadiusMm,
                AlCrRatio = x.AlCrRatio,
                DeviceName = x.DeviceName,
                Note = x.Note
            })
            .ToListAsync();
    }

    public async Task<EyeBiometricDto> CreateBiometricAsync(long visitId, CreateEyeBiometricDto request)
    {
        var visit = await GetVisitAsync(visitId);
        EnsureMeasurementStatus(visit);

        if (request.EyeSide != "OD" && request.EyeSide != "OS")
            throw new InvalidOperationException("EyeSide must be OD or OS.");

        var entity = new EyeBiometric
        {
            VisitId = visit.VisitId,
            PatientId = visit.PatientId,
            EyeSide = request.EyeSide,
            AxialLengthMm = request.AxialLengthMm,
            K1 = request.K1,
            K2 = request.K2,
            Kmax = request.Kmax,
            PachymetryUm = request.PachymetryUm,
            PupilSizeMm = request.PupilSizeMm,
            TbutSeconds = request.TbutSeconds,
            IopMmhg = request.IopMmhg,
            CornealRadiusMm = request.CornealRadiusMm,
            AlCrRatio = request.AlCrRatio,
            DeviceName = request.DeviceName,
            Note = request.Note,
            MeasuredBy = _currentUser.UserId,
            MeasuredAt = DateTime.UtcNow.AddHours(7)
        };

        _context.EyeBiometrics.Add(entity);
        await _context.SaveChangesAsync();

        return MapBiometric(entity);
    }

    public async Task<BinocularVisionDto?> GetBinocularVisionAsync(long visitId)
    {
        var visit = await GetVisitAsync(visitId);

        var entity = await _context.BinocularVisions
            .FirstOrDefaultAsync(x => x.VisitId == visit.VisitId);

        return entity == null ? null : MapBinocularVision(entity);
    }

    public async Task<BinocularVisionDto> CreateBinocularVisionAsync(long visitId, CreateBinocularVisionDto request)
    {
        var visit = await GetVisitAsync(visitId);
        EnsureMeasurementStatus(visit);

        var existed = await _context.BinocularVisions.AnyAsync(x => x.VisitId == visitId);
        if (existed)
            throw new InvalidOperationException("Binocular vision already exists for this visit.");

        var entity = new BinocularVision
        {
            VisitId = visit.VisitId,
            PatientId = visit.PatientId,
            AaOd = request.AaOd,
            AaOs = request.AaOs,
            MemOd = request.MemOd,
            MemOs = request.MemOs,
            FacilityOd = request.FacilityOd,
            FacilityOs = request.FacilityOs,
            CoverTestDistance = request.CoverTestDistance,
            CoverTestNear = request.CoverTestNear,
            AcARatio = request.AcARatio,
            NpcCm = request.NpcCm,
            Note = request.Note,
            MeasuredBy = _currentUser.UserId,
            MeasuredAt = DateTime.UtcNow.AddHours(7)
        };

        _context.BinocularVisions.Add(entity);
        await _context.SaveChangesAsync();

        return MapBinocularVision(entity);
    }

    public async Task<object> GetMeasurementHistoryAsync(long patientId)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(x => x.PatientId == patientId);
        if (patient == null)
            throw new KeyNotFoundException("Patient not found.");

        if (patient.ClinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(patient.ClinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        var refractions = await _context.EyeRefractions
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(x => x.MeasuredAt)
            .Select(x => MapRefraction(x))
            .ToListAsync();

        var biometrics = await _context.EyeBiometrics
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(x => x.MeasuredAt)
            .Select(x => MapBiometric(x))
            .ToListAsync();

        var binocularVisions = await _context.BinocularVisions
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(x => x.MeasuredAt)
            .Select(x => MapBinocularVision(x))
            .ToListAsync();

        return new
        {
            PatientId = patientId,
            Refractions = refractions,
            Biometrics = biometrics,
            BinocularVisions = binocularVisions
        };
    }

    public async Task<object> CompleteMeasurementAsync(long visitId)
    {
        var hasRefraction = await _context.EyeRefractions.AnyAsync(x => x.VisitId == visitId);
        var hasBiometric = await _context.EyeBiometrics.AnyAsync(x => x.VisitId == visitId);

        if (!hasRefraction)
            throw new InvalidOperationException("At least one refraction measurement is required.");

        if (!hasBiometric)
            throw new InvalidOperationException("At least one biometric measurement is required.");

        return await _visitService.ChangeStatusAsync(
            visitId,
            "WAITING_DOCTOR",
            "Measurement completed");
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

    private static void EnsureMeasurementStatus(Visit visit)
    {
        if (visit.Status != "IN_MEASUREMENT" && visit.Status != "WAITING_MEASUREMENT")
            throw new InvalidOperationException("Visit must be in measurement workflow.");
    }

    private static EyeRefractionDto MapRefraction(EyeRefraction x)
    {
        return new EyeRefractionDto
        {
            RefractionId = x.RefractionId,
            VisitId = x.VisitId,
            PatientId = x.PatientId,
            EyeSide = x.EyeSide,
            MeasurementType = x.MeasurementType,
            Sph = x.Sph,
            Cyl = x.Cyl,
            AxisDegree = x.AxisDegree,
            Va = x.Va,
            Bcva = x.Bcva,
            Ser = x.Ser,
            Note = x.Note
        };
    }

    private static EyeBiometricDto MapBiometric(EyeBiometric x)
    {
        return new EyeBiometricDto
        {
            BiometricId = x.BiometricId,
            VisitId = x.VisitId,
            PatientId = x.PatientId,
            EyeSide = x.EyeSide,
            AxialLengthMm = x.AxialLengthMm,
            K1 = x.K1,
            K2 = x.K2,
            Kmax = x.Kmax,
            PachymetryUm = x.PachymetryUm,
            PupilSizeMm = x.PupilSizeMm,
            TbutSeconds = x.TbutSeconds,
            IopMmhg = x.IopMmhg,
            CornealRadiusMm = x.CornealRadiusMm,
            AlCrRatio = x.AlCrRatio,
            DeviceName = x.DeviceName,
            Note = x.Note
        };
    }

    private static BinocularVisionDto MapBinocularVision(BinocularVision x)
    {
        return new BinocularVisionDto
        {
            BinocularId = x.BinocularId,
            VisitId = x.VisitId,
            PatientId = x.PatientId,
            AaOd = x.AaOd,
            AaOs = x.AaOs,
            MemOd = x.MemOd,
            MemOs = x.MemOs,
            FacilityOd = x.FacilityOd,
            FacilityOs = x.FacilityOs,
            CoverTestDistance = x.CoverTestDistance,
            CoverTestNear = x.CoverTestNear,
            AcARatio = x.AcARatio,
            NpcCm = x.NpcCm,
            Note = x.Note
        };
    }
}

