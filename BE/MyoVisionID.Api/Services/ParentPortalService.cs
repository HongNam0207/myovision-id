using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.ParentPortal;
using MyoVisionID.Api.Services.Interfaces;
using MyoVisionID.Api.Entities;

namespace MyoVisionID.Api.Services;

public class ParentPortalService : IParentPortalService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public ParentPortalService(AppDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<ParentChildDto>> GetMyChildrenAsync()
    {
        var parent = await GetCurrentParentAsync();

        return await _context.PatientParents
            .Where(x => x.ParentId == parent.ParentId && x.CanLogin == true)
            .Select(x => new ParentChildDto
            {
                PatientId = x.Patient.PatientId,
                PatientCode = x.Patient.PatientCode,
                FullName = x.Patient.FullName,
                DateOfBirth = x.Patient.DateOfBirth,
                Gender = x.Patient.Gender,
                SchoolName = x.Patient.SchoolName,
                Grade = x.Patient.Grade,
                Status = x.Patient.Status
            })
            .ToListAsync();
    }

    public async Task<object> GetChildProfileAsync(long patientId)
    {
        await EnsureParentCanAccessPatientAsync(patientId);

        var patient = await _context.Patients.FirstAsync(x => x.PatientId == patientId);

        return new
        {
            patient.PatientId,
            patient.PatientCode,
            patient.FullName,
            patient.DateOfBirth,
            patient.Gender,
            patient.Address,
            patient.SchoolName,
            patient.Grade,
            patient.Status
        };
    }

    public async Task<object> GetChildVisitsAsync(long patientId)
    {
        await EnsureParentCanAccessPatientAsync(patientId);

        return await _context.Visits
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(x => x.VisitDate)
            .Select(x => new
            {
                x.VisitId,
                x.VisitCode,
                x.VisitDate,
                x.VisitType,
                x.Status,
                x.ChiefComplaint
            })
            .ToListAsync();
    }

    public async Task<object> GetChildProgressAsync(long patientId)
    {
        await EnsureParentCanAccessPatientAsync(patientId);

        return await _context.ProgressSnapshots
            .Where(x => x.PatientId == patientId)
            .OrderBy(x => x.SnapshotDate)
            .Select(x => new
            {
                x.ProgressSnapshotId,
                x.VisitId,
                x.SnapshotDate,
                x.SerOd,
                x.SerOs,
                x.AxialLengthOd,
                x.AxialLengthOs,
                x.VaOd,
                x.VaOs,
                x.AlGrowthOd,
                x.AlGrowthOs,
                x.SerChangeOd,
                x.SerChangeOs,
                x.ProgressionNote
            })
            .ToListAsync();
    }

    public async Task<object> GetChildTreatmentPlanAsync(long patientId)
    {
        await EnsureParentCanAccessPatientAsync(patientId);

        return await _context.TreatmentPlans
            .Where(x => x.PatientId == patientId && x.Status == "ACTIVE")
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.TreatmentPlanId,
                x.VisitId,
                x.PlanName,
                x.TreatmentGoal,
                x.StartDate,
                x.EndDate,
                x.Status,
                x.ComplianceTarget,
                x.FollowUpIntervalDays,
                x.DoctorInstruction,
                Items = _context.TreatmentPlanItems
                    .Where(i => i.TreatmentPlanId == x.TreatmentPlanId && i.Status == "ACTIVE")
                    .Select(i => new
                    {
                        i.TreatmentPlanItemId,
                        i.TreatmentMethodId,
                        i.ItemName,
                        i.DosageOrSpecification,
                        i.Frequency,
                        i.Instruction
                    })
                    .ToList()
            })
            .ToListAsync();
    }

    public async Task<object> GetChildReportsAsync(long patientId)
    {
        await EnsureParentCanAccessPatientAsync(patientId);

        return await _context.MedicalReports
            .Where(x => x.PatientId == patientId && x.IsVisibleToParent == true)
            .OrderByDescending(x => x.GeneratedAt)
            .Select(x => new
            {
                x.ReportId,
                x.VisitId,
                x.ReportType,
                x.ReportTitle,
                x.PdfUrl,
                x.GeneratedAt
            })
            .ToListAsync();
    }

    public async Task<object> GetChildNotificationsAsync(long patientId)
    {
        var parent = await EnsureParentCanAccessPatientAsync(patientId);

        return await _context.ParentNotifications
            .Where(x => x.ParentId == parent.ParentId && x.PatientId == patientId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.NotificationId,
                x.Title,
                x.Content,
                x.NotificationType,
                IsRead = x.IsRead ?? false,
                x.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<object> GetChildAppointmentsAsync(long patientId)
    {
        var parent = await EnsureParentCanAccessPatientAsync(patientId);

        return await _context.Appointments
            .Where(x => x.PatientId == patientId && x.ParentId == parent.ParentId)
            .OrderByDescending(x => x.AppointmentDatetime)
            .Select(x => new
            {
                x.AppointmentId,
                x.AppointmentDatetime,
                x.AppointmentType,
                x.Status,
                x.Reason,
                x.Note
            })
            .ToListAsync();
    }

    public async Task<object> CheckAccessAsync(long patientId)
    {
        var parent = await GetCurrentParentAsync();

        var canAccess = await _context.PatientParents.AnyAsync(x =>
            x.ParentId == parent.ParentId &&
            x.PatientId == patientId &&
            x.CanLogin == true);

        return new
        {
            PatientId = patientId,
            CanAccess = canAccess
        };
    }

    private async Task<Parent> GetCurrentParentAsync()
    {
        var parent = await _context.Parents
            .FirstOrDefaultAsync(x => x.UserId == _currentUser.UserId);

        if (parent == null)
            throw new UnauthorizedAccessException("Current user is not linked to a parent profile.");

        return parent;
    }

    private async Task<Parent> EnsureParentCanAccessPatientAsync(long patientId)
    {
        var parent = await GetCurrentParentAsync();

        var canAccess = await _context.PatientParents.AnyAsync(x =>
            x.ParentId == parent.ParentId &&
            x.PatientId == patientId &&
            x.CanLogin == true);

        if (!canAccess)
            throw new UnauthorizedAccessException("You cannot access this patient.");

        return parent;
    }
}

