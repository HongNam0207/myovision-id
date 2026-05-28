using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Treatments;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class TreatmentService : ITreatmentService
{
    private readonly AppDbContext _context;
    private readonly IClinicScopeService _clinicScope;
    private readonly ICurrentUserService _currentUser;

    public TreatmentService(
        AppDbContext context,
        IClinicScopeService clinicScope,
        ICurrentUserService currentUser)
    {
        _context = context;
        _clinicScope = clinicScope;
        _currentUser = currentUser;
    }

    public async Task<List<TreatmentPlanDto>> GetPatientPlansAsync(long patientId)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(x => x.PatientId == patientId);

        if (patient == null)
            throw new KeyNotFoundException("Patient not found.");

        if (patient.ClinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(patient.ClinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        return await _context.TreatmentPlans
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => MapPlan(x))
            .ToListAsync();
    }

    public async Task<TreatmentPlanDto> GetPlanAsync(long planId)
    {
        var plan = await GetPlanEntityAsync(planId);
        return MapPlan(plan);
    }

    public async Task<TreatmentPlanDto> CreatePlanAsync(long visitId, UpsertTreatmentPlanDto request)
    {
        var visit = await GetVisitAsync(visitId);

        if (visit.Status != "IN_DIAGNOSIS" &&
            visit.Status != "WAITING_APPROVAL" &&
            visit.Status != "COMPLETED")
        {
            throw new InvalidOperationException("Visit must be in doctor workflow before creating treatment plan.");
        }

        ValidatePlan(request);

        var existed = await _context.TreatmentPlans.AnyAsync(x => x.VisitId == visitId);

        if (existed)
            throw new InvalidOperationException("Treatment plan already exists for this visit.");

        var entity = new TreatmentPlan
        {
            VisitId = visit.VisitId,
            PatientId = visit.PatientId,
            DoctorId = _currentUser.UserId,
            PlanName = request.PlanName,
            TreatmentGoal = request.TreatmentGoal,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            ComplianceTarget = request.ComplianceTarget,
            FollowUpIntervalDays = request.FollowUpIntervalDays,
            DoctorInstruction = request.DoctorInstruction,
            Status = "ACTIVE",
            CreatedAt = DateTime.UtcNow
        };

        _context.TreatmentPlans.Add(entity);
        await _context.SaveChangesAsync();

        return MapPlan(entity);
    }

    public async Task<TreatmentPlanDto> UpdatePlanAsync(long planId, UpsertTreatmentPlanDto request)
    {
        var entity = await GetPlanEntityAsync(planId);

        if (entity.Status == "CANCELLED")
            throw new InvalidOperationException("Cannot update cancelled treatment plan.");

        ValidatePlan(request);

        entity.PlanName = request.PlanName;
        entity.TreatmentGoal = request.TreatmentGoal;
        entity.StartDate = request.StartDate;
        entity.EndDate = request.EndDate;
        entity.ComplianceTarget = request.ComplianceTarget;
        entity.FollowUpIntervalDays = request.FollowUpIntervalDays;
        entity.DoctorInstruction = request.DoctorInstruction;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapPlan(entity);
    }

    public async Task<TreatmentPlanDto> ChangePlanStatusAsync(long planId, string status)
    {
        var entity = await GetPlanEntityAsync(planId);

        var validStatuses = new[] { "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED" };

        if (!validStatuses.Contains(status))
            throw new InvalidOperationException("Invalid treatment plan status.");

        entity.Status = status;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapPlan(entity);
    }

    public async Task<List<TreatmentPlanItemDto>> GetPlanItemsAsync(long planId)
    {
        await GetPlanEntityAsync(planId);

        return await _context.TreatmentPlanItems
            .Where(x => x.TreatmentPlanId == planId)
            .OrderBy(x => x.TreatmentPlanItemId)
            .Select(x => MapItem(x))
            .ToListAsync();
    }

    public async Task<TreatmentPlanItemDto> CreatePlanItemAsync(long planId, CreateTreatmentPlanItemDto request)
    {
        var plan = await GetPlanEntityAsync(planId);

        if (plan.Status != "ACTIVE")
            throw new InvalidOperationException("Only active treatment plan can add item.");

        var methodExists = await _context.TreatmentMethods
            .AnyAsync(x => x.TreatmentMethodId == request.TreatmentMethodId && x.IsActive == true);

        if (!methodExists)
            throw new KeyNotFoundException("Treatment method not found or inactive.");

        var entity = new TreatmentPlanItem
        {
            TreatmentPlanId = planId,
            TreatmentMethodId = request.TreatmentMethodId,
            ItemName = request.ItemName,
            DosageOrSpecification = request.DosageOrSpecification,
            Frequency = request.Frequency,
            Instruction = request.Instruction,
            Status = "ACTIVE",
            CreatedAt = DateTime.UtcNow
        };

        _context.TreatmentPlanItems.Add(entity);
        await _context.SaveChangesAsync();

        return MapItem(entity);
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

    private async Task<TreatmentPlan> GetPlanEntityAsync(long planId)
    {
        var plan = await _context.TreatmentPlans
            .Include(x => x.Visit)
            .FirstOrDefaultAsync(x => x.TreatmentPlanId == planId);

        if (plan == null)
            throw new KeyNotFoundException("Treatment plan not found.");

        if (plan.Visit.ClinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(plan.Visit.ClinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        return plan;
    }

    private static void ValidatePlan(UpsertTreatmentPlanDto request)
    {
        if (request.StartDate.HasValue && request.EndDate.HasValue && request.EndDate < request.StartDate)
            throw new InvalidOperationException("EndDate must be greater than or equal to StartDate.");

        if (request.FollowUpIntervalDays is < 1 or > 365)
            throw new InvalidOperationException("FollowUpIntervalDays must be between 1 and 365.");
    }

    private static TreatmentPlanDto MapPlan(TreatmentPlan x)
    {
        return new TreatmentPlanDto
        {
            TreatmentPlanId = x.TreatmentPlanId,
            VisitId = x.VisitId,
            PatientId = x.PatientId,
            DoctorId = x.DoctorId,
            PlanName = x.PlanName,
            TreatmentGoal = x.TreatmentGoal,
            StartDate = x.StartDate,
            EndDate = x.EndDate,
            Status = x.Status,
            ComplianceTarget = x.ComplianceTarget,
            FollowUpIntervalDays = x.FollowUpIntervalDays,
            DoctorInstruction = x.DoctorInstruction,
            CreatedAt = x.CreatedAt,
            UpdatedAt = x.UpdatedAt
        };
    }

    private static TreatmentPlanItemDto MapItem(TreatmentPlanItem x)
    {
        return new TreatmentPlanItemDto
        {
            TreatmentPlanItemId = x.TreatmentPlanItemId,
            TreatmentPlanId = x.TreatmentPlanId,
            TreatmentMethodId = x.TreatmentMethodId,
            ItemName = x.ItemName,
            DosageOrSpecification = x.DosageOrSpecification,
            Frequency = x.Frequency,
            Instruction = x.Instruction,
            Status = x.Status
        };
    }
}
