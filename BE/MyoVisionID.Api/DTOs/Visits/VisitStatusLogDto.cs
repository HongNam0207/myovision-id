namespace MyoVisionID.Api.DTOs.Visits;

public class VisitStatusLogDto
{
    public long StatusLogId { get; set; }
    public long VisitId { get; set; }
    public string? OldStatus { get; set; }
    public string NewStatus { get; set; } = string.Empty;
    public long? ChangedBy { get; set; }
    public string? ChangedByName { get; set; }
    public string? Note { get; set; }
    public DateTime? ChangedAt { get; set; }
}
