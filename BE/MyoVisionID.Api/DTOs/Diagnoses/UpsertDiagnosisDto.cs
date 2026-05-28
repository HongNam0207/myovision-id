using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.Diagnoses;

public class UpsertDiagnosisDto
{
    [StringLength(100)]
    public string? DiagnosisCode { get; set; }

    [Required]
    [StringLength(500, MinimumLength = 2)]
    public string DiagnosisName { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? ClinicalConclusion { get; set; }

    [StringLength(255)]
    public string? MyopiaType { get; set; }

    [RegularExpression(ValidationRegex.SeverityLevel)]
    public string? SeverityLevel { get; set; }

    [RegularExpression(ValidationRegex.ProgressionStatus)]
    public string? ProgressionStatus { get; set; }
}
