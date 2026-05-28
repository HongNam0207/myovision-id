namespace MyoVisionID.Api.DTOs.Progress;

public class CreateFollowUpDto
{
    public long? VisitId { get; set; }
    public long? TreatmentPlanId { get; set; }
    public DateOnly FollowUpDate { get; set; }
    public string? ComplianceLevel { get; set; }
    public string? SideEffects { get; set; }
    public string? ParentFeedback { get; set; }
    public string? DoctorNote { get; set; }
    public DateOnly? NextFollowUpDate { get; set; }
}
