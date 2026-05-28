using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.FollowUps;

public class CreateFollowUpDto
{
    [Required]
    public DateOnly FollowUpDate { get; set; }

    [RegularExpression(ValidationRegex.ComplianceLevel)]
    public string? ComplianceLevel { get; set; }

    [StringLength(1000)]
    public string? SideEffects { get; set; }

    [StringLength(1000)]
    public string? ParentFeedback { get; set; }

    [StringLength(2000)]
    public string? DoctorNote { get; set; }

    public DateOnly? NextFollowUpDate { get; set; }
}
