namespace MyoVisionID.Api.DTOs.Visits;

public class VisitTimelineItemDto
{
    public string Type { get; set; } = "STATUS";
    public string Title { get; set; } = string.Empty;
    public string? Note { get; set; }
    public DateTime? EventTime { get; set; }
}

