using System.ComponentModel.DataAnnotations;

namespace MyoVisionID.Api.Common.Validation;

public class NotPastDateTimeAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        if (value is null) return true;

        if (value is DateTime dateTime)
            return dateTime >= DateTime.Now.AddMinutes(-5);

        return false;
    }
}
