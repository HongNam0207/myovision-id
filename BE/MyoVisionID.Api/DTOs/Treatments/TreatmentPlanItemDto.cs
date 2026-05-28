namespace MyoVisionID.Api.DTOs.Treatments;

public class TreatmentPlanItemDto
{
    public long TreatmentPlanItemId { get; set; }
    public long TreatmentPlanId { get; set; }
    public long TreatmentMethodId { get; set; }
    public string? ItemName { get; set; }
    public string? DosageOrSpecification { get; set; }
    public string? Frequency { get; set; }
    public string? Instruction { get; set; }
    public string? Status { get; set; }
}

