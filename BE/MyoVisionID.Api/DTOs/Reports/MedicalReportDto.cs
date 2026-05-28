namespace MyoVisionID.Api.DTOs.Reports;

public class MedicalReportDto
{
    public long ReportId { get; set; }
    public long VisitId { get; set; }
    public long PatientId { get; set; }
    public string? ReportType { get; set; }
    public string? ReportTitle { get; set; }
    public string? ReportContent { get; set; }
    public string? PdfUrl { get; set; }
    public bool IsVisibleToParent { get; set; }
    public long? GeneratedBy { get; set; }
    public DateTime? GeneratedAt { get; set; }
}

