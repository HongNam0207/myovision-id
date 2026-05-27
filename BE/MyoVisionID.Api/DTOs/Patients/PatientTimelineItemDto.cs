namespace MyoVisionID.Api.DTOs.Patients;

public class PatientTimelineItemDto
{
    public string Type { get; set; } = string.Empty;
    public long? RefId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Status { get; set; }
    public DateTime EventTime { get; set; }
}
