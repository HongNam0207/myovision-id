namespace MyoVisionID.Api.DTOs.Reports;

public class GenerateReportDto
{
    public string? ReportType { get; set; }
    public string? ReportTitle { get; set; }
    public bool IsVisibleToParent { get; set; } = true;
}
