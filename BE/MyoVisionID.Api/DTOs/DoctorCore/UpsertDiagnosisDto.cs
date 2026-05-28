namespace MyoVisionID.Api.DTOs.DoctorCore;

public class UpsertDiagnosisDto
{
    public string? DiagnosisCode { get; set; }
    public string? DiagnosisName { get; set; }
    public string? ClinicalConclusion { get; set; }
    public string? MyopiaType { get; set; }
    public string? SeverityLevel { get; set; }
    public string? ProgressionStatus { get; set; }
}

