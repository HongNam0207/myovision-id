using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.RiskAssessments;

public class UpdateRiskAssessmentDto
{
    [Range(0, 100)]
    public decimal? TotalScore { get; set; }

    [RegularExpression(ValidationRegex.RiskLevel)]
    public string? RiskLevel { get; set; }

    public bool AlCrWarning { get; set; }

    public bool ProgressionWarning { get; set; }

    [StringLength(2000)]
    public string? Recommendation { get; set; }
}

