namespace MyoVisionID.Api.DTOs.Treatments;

public class CreateTreatmentPlanItemDto
{
    public long TreatmentMethodId { get; set; }
    public string? ItemName { get; set; }
    public string? DosageOrSpecification { get; set; }
    public string? Frequency { get; set; }
    public string? Instruction { get; set; }
}
