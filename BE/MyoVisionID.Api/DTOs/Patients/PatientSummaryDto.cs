namespace MyoVisionID.Api.DTOs.Patients;

public class PatientSummaryDto
{
    public long PatientId { get; set; }
    public string PatientCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public int Age { get; set; }
    public string? Gender { get; set; }
    public string? ClinicName { get; set; }
    public string Status { get; set; } = "ACTIVE";
    public int VisitCount { get; set; }
    public DateTime? LatestVisitDate { get; set; }
    public string? LatestVisitStatus { get; set; }
    public int ParentCount { get; set; }
}
