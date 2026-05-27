namespace MyoVisionID.Api.DTOs.Visits;

public class ChangeVisitStatusDto
{
    public string NewStatus { get; set; } = string.Empty;
    public string? Note { get; set; }
}
