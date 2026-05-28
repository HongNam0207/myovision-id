using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.Visits;

public class ChangeVisitStatusDto
{
    [Required]
    [RegularExpression(ValidationRegex.VisitStatus)]
    public string NewStatus { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Note { get; set; }
}
