namespace MyoVisionID.Api.DTOs.Treatments;

public class TreatmentPlanDto
{
    public long TreatmentPlanId { get; set; }
    public long VisitId { get; set; }
    public long PatientId { get; set; }
    public long DoctorId { get; set; }
    public string? PlanName { get; set; }
    public string? TreatmentGoal { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Status { get; set; }
    public string? ComplianceTarget { get; set; }
    public int? FollowUpIntervalDays { get; set; }
    public string? DoctorInstruction { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

