using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.TreatmentPlans;

public class CreateTreatmentPlanDto
{
    [Required]
    [StringLength(255, MinimumLength = 2)]
    public string PlanName { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? TreatmentGoal { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    [RegularExpression(ValidationRegex.TreatmentPlanStatus)]
    public string Status { get; set; } = "ACTIVE";

    [StringLength(500)]
    public string? ComplianceTarget { get; set; }

    [Range(1, 365)]
    public int? FollowUpIntervalDays { get; set; }

    [StringLength(4000)]
    public string? DoctorInstruction { get; set; }
}
