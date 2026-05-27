namespace MyoVisionID.Api.DTOs.Visits;

public class VisitApprovalDto
{
    public long ApprovalId { get; set; }
    public long VisitId { get; set; }
    public long ApprovedBy { get; set; }
    public string? ApprovedByName { get; set; }
    public string ApprovalStatus { get; set; } = "APPROVED";
    public string? ApprovalNote { get; set; }
    public DateTime? ApprovedAt { get; set; }
}
