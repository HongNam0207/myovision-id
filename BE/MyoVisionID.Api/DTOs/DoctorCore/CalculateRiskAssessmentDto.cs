namespace MyoVisionID.Api.DTOs.DoctorCore;

public class CalculateRiskAssessmentDto
{
    public long? RiskModelId { get; set; }
    public string? Recommendation { get; set; }
}

