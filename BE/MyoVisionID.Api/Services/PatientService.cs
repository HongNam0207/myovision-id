using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Patients;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class PatientService : IPatientService
{
    private readonly AppDbContext _context;
    private readonly IClinicScopeService _clinicScope;
    private readonly ICurrentUserService _currentUser;

    public PatientService(AppDbContext context, IClinicScopeService clinicScope, ICurrentUserService currentUser)
    {
        _context = context;
        _clinicScope = clinicScope;
        _currentUser = currentUser;
    }

    public async Task<List<PatientResponseDto>> GetAllAsync()
    {
        var clinicIds = await _clinicScope.GetAccessibleClinicIdsAsync();

        return await _context.Patients
            .Include(x => x.Clinic)
            .Where(x => x.ClinicId != null && clinicIds.Contains(x.ClinicId.Value))
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => Map(x))
            .ToListAsync();
    }

    public async Task<PatientResponseDto> GetByIdAsync(long patientId)
    {
        var patient = await GetPatientWithAccessCheck(patientId);
        return Map(patient);
    }

    public async Task<PatientResponseDto> CreateAsync(CreatePatientDto request)
    {
        if (!await _clinicScope.CanAccessClinicAsync(request.ClinicId))
            throw new UnauthorizedAccessException("Clinic access denied.");

        if (await _context.Patients.AnyAsync(x => x.PatientCode == request.PatientCode))
            throw new InvalidOperationException("Patient code already exists.");

        var patient = new Patient
        {
            PatientCode = request.PatientCode,
            HospitalPatientCode = request.HospitalPatientCode,
            FullName = request.FullName,
            DateOfBirth = request.DateOfBirth,
            Gender = request.Gender,
            Address = request.Address,
            SchoolName = request.SchoolName,
            Grade = request.Grade,
            ClinicId = request.ClinicId,
            Status = "ACTIVE",
            CreatedBy = _currentUser.UserId,
            CreatedAt = DateTime.UtcNow.AddHours(7)
        };

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(patient.PatientId);
    }

    public async Task<PatientResponseDto> UpdateAsync(long patientId, UpdatePatientDto request)
    {
        var patient = await GetPatientWithAccessCheck(patientId);

        patient.FullName = request.FullName;
        patient.DateOfBirth = request.DateOfBirth;
        patient.Gender = request.Gender;
        patient.Address = request.Address;
        patient.SchoolName = request.SchoolName;
        patient.Grade = request.Grade;
        patient.Status = request.Status;
        patient.UpdatedAt = DateTime.UtcNow.AddHours(7);

        await _context.SaveChangesAsync();

        return await GetByIdAsync(patientId);
    }

    public async Task DeleteAsync(long patientId)
    {
        var patient = await GetPatientWithAccessCheck(patientId);

        patient.Status = "INACTIVE";
        patient.UpdatedAt = DateTime.UtcNow.AddHours(7);

        await _context.SaveChangesAsync();
    }

    public async Task<PatientSummaryDto> GetSummaryAsync(long patientId)
    {
        var patient = await GetPatientWithAccessCheck(patientId);

        var latestVisit = await _context.Visits
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(x => x.VisitDate)
            .FirstOrDefaultAsync();

        var visitCount = await _context.Visits.CountAsync(x => x.PatientId == patientId);
        var parentCount = await _context.PatientParents.CountAsync(x => x.PatientId == patientId);

        var today = DateOnly.FromDateTime(DateTime.Today);
        var age = today.Year - patient.DateOfBirth.Year;
        if (patient.DateOfBirth > today.AddYears(-age)) age--;

        return new PatientSummaryDto
        {
            PatientId = patient.PatientId,
            PatientCode = patient.PatientCode,
            FullName = patient.FullName,
            Age = age,
            Gender = patient.Gender,
            ClinicName = patient.Clinic?.ClinicName,
            Status = patient.Status ?? "ACTIVE",
            VisitCount = visitCount,
            LatestVisitDate = latestVisit?.VisitDate,
            LatestVisitStatus = latestVisit?.Status,
            ParentCount = parentCount
        };
    }

    public async Task<List<PatientTimelineItemDto>> GetTimelineAsync(long patientId)
    {
        _ = await GetPatientWithAccessCheck(patientId);

        return await _context.Visits
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(x => x.VisitDate)
            .Select(x => new PatientTimelineItemDto
            {
                Type = "VISIT",
                RefId = x.VisitId,
                Title = x.VisitCode,
                Status = x.Status,
                EventTime = x.VisitDate
            })
            .ToListAsync();
    }

    private async Task<Patient> GetPatientWithAccessCheck(long patientId)
    {
        var patient = await _context.Patients
            .Include(x => x.Clinic)
            .FirstOrDefaultAsync(x => x.PatientId == patientId);

        if (patient == null)
            throw new KeyNotFoundException("Patient not found.");

        if (patient.ClinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(patient.ClinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        return patient;
    }

    private static PatientResponseDto Map(Patient patient)
    {
        return new PatientResponseDto
        {
            PatientId = patient.PatientId,
            PatientCode = patient.PatientCode,
            HospitalPatientCode = patient.HospitalPatientCode,
            FullName = patient.FullName,
            DateOfBirth = patient.DateOfBirth,
            Gender = patient.Gender,
            Address = patient.Address,
            SchoolName = patient.SchoolName,
            Grade = patient.Grade,
            ClinicId = patient.ClinicId,
            ClinicName = patient.Clinic?.ClinicName,
            Status = patient.Status ?? "ACTIVE",
            CreatedAt = patient.CreatedAt
        };
    }
}

