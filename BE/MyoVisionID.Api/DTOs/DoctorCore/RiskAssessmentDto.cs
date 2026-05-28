namespace MyoVisionID.Api.DTOs.DoctorCore;

public class RiskAssessmentDto
{
    public long RiskAssessmentId { get; set; }
    public long VisitId { get; set; }
    public long PatientId { get; set; }
    public long? RiskModelId { get; set; }
    public decimal? TotalScore { get; set; }
    public string? RiskLevel { get; set; }
    public bool AlCrWarning { get; set; }
    public bool ProgressionWarning { get; set; }
    public string? Recommendation { get; set; }
    public long? AssessedBy { get; set; }
    public DateTime? AssessedAt { get; set; }
}
