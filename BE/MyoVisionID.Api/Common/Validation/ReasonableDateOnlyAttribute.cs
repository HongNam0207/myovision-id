using System.ComponentModel.DataAnnotations;

namespace MyoVisionID.Api.Common.Validation;

public class ReasonableDateOnlyAttribute : ValidationAttribute
{
    private readonly int _minYear;
    private readonly int _maxFutureYears;

    public ReasonableDateOnlyAttribute(int minYear = 1900, int maxFutureYears = 10)
    {
        _minYear = minYear;
        _maxFutureYears = maxFutureYears;
    }

    public override bool IsValid(object? value)
    {
        if (value is null) return true;

        if (value is DateOnly date)
        {
            var maxDate = DateOnly.FromDateTime(DateTime.Today.AddYears(_maxFutureYears));
            return date.Year >= _minYear && date <= maxDate;
        }

        return false;
    }
}
