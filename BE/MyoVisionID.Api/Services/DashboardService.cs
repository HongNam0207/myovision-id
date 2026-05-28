using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public DashboardService(AppDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<object> GetAdminOverviewAsync()
    {
        var today = DateTime.UtcNow.Date;

        return new
        {
            TotalUsers = await _context.Users.CountAsync(),
            TotalPatients = await _context.Patients.CountAsync(),
            TotalClinics = await _context.Clinics.CountAsync(),
            TotalVisits = await _context.Visits.CountAsync(),
            TodayVisits = await _context.Visits.CountAsync(x => x.VisitDate.Date == today),
            WaitingIntake = await _context.Visits.CountAsync(x => x.Status == "WAITING_INTAKE"),
            WaitingMeasurement = await _context.Visits.CountAsync(x => x.Status == "WAITING_MEASUREMENT"),
            WaitingDoctor = await _context.Visits.CountAsync(x => x.Status == "WAITING_DOCTOR"),
            CompletedVisits = await _context.Visits.CountAsync(x => x.Status == "COMPLETED"),
            HighRiskPatients = await _context.RiskAssessments.CountAsync(x => x.RiskLevel == "HIGH"),
            ActiveTreatmentPlans = await _context.TreatmentPlans.CountAsync(x => x.Status == "ACTIVE"),
            UpcomingAppointments = await _context.Appointments.CountAsync(x =>
                x.AppointmentDatetime >= DateTime.UtcNow &&
                x.Status == "BOOKED")
        };
    }

    public async Task<object> GetDoctorTodayVisitsAsync()
    {
        var today = DateTime.UtcNow.Date;
        var userId = _currentUser.UserId;

        var visits = await _context.Visits
            .Where(x =>
                x.AssignedDoctorId == userId &&
                x.VisitDate.Date == today)
            .OrderBy(x => x.VisitDate)
            .Select(x => new
            {
                x.VisitId,
                x.VisitCode,
                x.PatientId,
                PatientName = x.Patient.FullName,
                x.VisitDate,
                x.VisitType,
                x.Status,
                x.ChiefComplaint
            })
            .ToListAsync();

        return new
        {
            DoctorId = userId,
            Total = visits.Count,
            WaitingDoctor = visits.Count(x => x.Status == "WAITING_DOCTOR"),
            InDiagnosis = visits.Count(x => x.Status == "IN_DIAGNOSIS"),
            WaitingApproval = visits.Count(x => x.Status == "WAITING_APPROVAL"),
            Completed = visits.Count(x => x.Status == "COMPLETED"),
            Items = visits
        };
    }

    public async Task<object> GetNurseWaitingIntakeAsync()
    {
        var items = await _context.Visits
            .Where(x => x.Status == "WAITING_INTAKE" || x.Status == "IN_INTAKE")
            .OrderBy(x => x.VisitDate)
            .Select(x => new
            {
                x.VisitId,
                x.VisitCode,
                x.PatientId,
                PatientName = x.Patient.FullName,
                x.VisitDate,
                x.VisitType,
                x.Status,
                x.ChiefComplaint
            })
            .ToListAsync();

        return new
        {
            Total = items.Count,
            WaitingIntake = items.Count(x => x.Status == "WAITING_INTAKE"),
            InIntake = items.Count(x => x.Status == "IN_INTAKE"),
            Items = items
        };
    }

    public async Task<object> GetOptometristWaitingMeasurementAsync()
    {
        var items = await _context.Visits
            .Where(x => x.Status == "WAITING_MEASUREMENT" || x.Status == "IN_MEASUREMENT")
            .OrderBy(x => x.VisitDate)
            .Select(x => new
            {
                x.VisitId,
                x.VisitCode,
                x.PatientId,
                PatientName = x.Patient.FullName,
                x.VisitDate,
                x.VisitType,
                x.Status,
                x.ChiefComplaint
            })
            .ToListAsync();

        return new
        {
            Total = items.Count,
            WaitingMeasurement = items.Count(x => x.Status == "WAITING_MEASUREMENT"),
            InMeasurement = items.Count(x => x.Status == "IN_MEASUREMENT"),
            Items = items
        };
    }

    public async Task<object> GetParentChildrenSummaryAsync()
    {
        var parent = await _context.Parents
            .FirstOrDefaultAsync(x => x.UserId == _currentUser.UserId);

        if (parent == null)
            throw new UnauthorizedAccessException("Current user is not linked to a parent profile.");

        var children = await _context.PatientParents
            .Where(x => x.ParentId == parent.ParentId && x.CanLogin == true)
            .Select(x => new
            {
                x.Patient.PatientId,
                x.Patient.PatientCode,
                x.Patient.FullName,
                x.Patient.DateOfBirth,
                x.Patient.Gender,
                LatestVisit = _context.Visits
                    .Where(v => v.PatientId == x.PatientId)
                    .OrderByDescending(v => v.VisitDate)
                    .Select(v => new
                    {
                        v.VisitId,
                        v.VisitCode,
                        v.VisitDate,
                        v.Status
                    })
                    .FirstOrDefault(),
                LatestRisk = _context.RiskAssessments
                    .Where(r => r.PatientId == x.PatientId)
                    .OrderByDescending(r => r.AssessedAt)
                    .Select(r => new
                    {
                        r.RiskLevel,
                        r.TotalScore,
                        r.Recommendation
                    })
                    .FirstOrDefault(),
                UpcomingAppointment = _context.Appointments
                    .Where(a =>
                        a.PatientId == x.PatientId &&
                        a.AppointmentDatetime >= DateTime.UtcNow &&
                        a.Status == "BOOKED")
                    .OrderBy(a => a.AppointmentDatetime)
                    .Select(a => new
                    {
                        a.AppointmentId,
                        a.AppointmentDatetime,
                        a.AppointmentType,
                        a.Status
                    })
                    .FirstOrDefault()
            })
            .ToListAsync();

        return new
        {
            ParentId = parent.ParentId,
            TotalChildren = children.Count,
            Children = children
        };
    }
}
