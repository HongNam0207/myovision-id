using System.ComponentModel.DataAnnotations;

namespace MyoVisionID.Api.DTOs.TreatmentPlans;

public class CreateTreatmentPlanItemDto
{
    [Range(1, long.MaxValue)]
    public long TreatmentMethodId { get; set; }

    [Required]
    [StringLength(255, MinimumLength = 2)]
    public string ItemName { get; set; } = string.Empty;

    [StringLength(500)]
    public string? DosageOrSpecification { get; set; }

    [StringLength(255)]
    public string? Frequency { get; set; }

    [StringLength(4000)]
    public string? Instruction { get; set; }
}
