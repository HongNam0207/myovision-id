using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.Reports;

public class GenerateMedicalReportDto
{
    [Required]
    [RegularExpression(ValidationRegex.ReportType)]
    public string ReportType { get; set; } = "VISIT_SUMMARY";

    [Required]
    [StringLength(255, MinimumLength = 2)]
    public string ReportTitle { get; set; } = string.Empty;

    [StringLength(8000)]
    public string? ReportContent { get; set; }

    public bool IsVisibleToParent { get; set; } = true;
}
