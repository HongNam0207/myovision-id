using System.ComponentModel.DataAnnotations;

namespace MyoVisionID.Api.Common.Validation;

public class NotFutureDateAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        if (value is null) return true;

        if (value is DateOnly dateOnly)
            return dateOnly <= DateOnly.FromDateTime(DateTime.Today);

        if (value is DateTime dateTime)
            return dateTime.Date <= DateTime.Today;

        return false;
    }
}
