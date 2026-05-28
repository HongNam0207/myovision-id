namespace MyoVisionID.Api.DTOs.DoctorCore;

public class DiagnosisDto
{
    public long DiagnosisId { get; set; }
    public long VisitId { get; set; }
    public long PatientId { get; set; }
    public long DoctorId { get; set; }
    public string? DiagnosisCode { get; set; }
    public string? DiagnosisName { get; set; }
    public string? ClinicalConclusion { get; set; }
    public string? MyopiaType { get; set; }
    public string? SeverityLevel { get; set; }
    public string? ProgressionStatus { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
