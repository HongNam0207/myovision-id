namespace MyoVisionID.Api.DTOs.Treatments;

public class UpsertTreatmentPlanDto
{
    public string? PlanName { get; set; }
    public string? TreatmentGoal { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? ComplianceTarget { get; set; }
    public int? FollowUpIntervalDays { get; set; }
    public string? DoctorInstruction { get; set; }
}

