using System.ComponentModel.DataAnnotations;

namespace MyoVisionID.Api.DTOs.TreatmentPlans;

public class TreatmentPlanDateRangeDto : IValidatableObject
{
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (StartDate.HasValue && EndDate.HasValue && EndDate.Value < StartDate.Value)
        {
            yield return new ValidationResult(
                "EndDate must be greater than or equal to StartDate.",
                new[] { nameof(EndDate) });
        }
    }
}
