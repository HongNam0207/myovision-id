namespace MyoVisionID.Api.DTOs.Progress;

public class FollowUpDto
{
    public long FollowUpId { get; set; }
    public long PatientId { get; set; }
    public long? VisitId { get; set; }
    public long? TreatmentPlanId { get; set; }
    public DateOnly FollowUpDate { get; set; }
    public string? ComplianceLevel { get; set; }
    public string? SideEffects { get; set; }
    public string? ParentFeedback { get; set; }
    public string? DoctorNote { get; set; }
    public DateOnly? NextFollowUpDate { get; set; }
    public long? CreatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
}

