namespace MyoVisionID.Api.DTOs.Visits;

public class VisitResponseDto
{
    public long VisitId { get; set; }
    public string VisitCode { get; set; } = string.Empty;
    public long PatientId { get; set; }
    public string? PatientName { get; set; }
    public long? ClinicId { get; set; }
    public string? ClinicName { get; set; }
    public DateTime VisitDate { get; set; }
    public string VisitType { get; set; } = "INITIAL";
    public string Status { get; set; } = "CREATED";
    public string? ChiefComplaint { get; set; }
    public long? AssignedDoctorId { get; set; }
    public string? AssignedDoctorName { get; set; }
    public long? CreatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
}
