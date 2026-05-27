namespace MyoVisionID.Api.DTOs.Visits;

public class VisitSummaryDto
{
    public long VisitId { get; set; }
    public string VisitCode { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime VisitDate { get; set; }
    public string? PatientName { get; set; }
    public string? ClinicName { get; set; }
    public string? AssignedDoctorName { get; set; }
    public int StatusLogCount { get; set; }
}
