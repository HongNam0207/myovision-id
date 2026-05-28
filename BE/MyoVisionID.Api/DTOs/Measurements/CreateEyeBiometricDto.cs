using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.Measurements;

public class CreateEyeBiometricDto
{
    [Required]
    [RegularExpression(ValidationRegex.EyeSide)]
    public string EyeSide { get; set; } = string.Empty;

    [Range(10, 40)]
    public decimal? AxialLengthMm { get; set; }

    [Range(20, 70)]
    public decimal? K1 { get; set; }

    [Range(20, 70)]
    public decimal? K2 { get; set; }

    [Range(20, 80)]
    public decimal? Kmax { get; set; }

    [Range(300, 800)]
    public decimal? PachymetryUm { get; set; }

    [Range(1, 12)]
    public decimal? PupilSizeMm { get; set; }

    [Range(0, 60)]
    public decimal? TbutSeconds { get; set; }

    [Range(0, 80)]
    public decimal? IopMmhg { get; set; }

    [Range(4, 10)]
    public decimal? CornealRadiusMm { get; set; }

    [Range(1, 10)]
    public decimal? AlCrRatio { get; set; }

    [StringLength(255)]
    public string? DeviceName { get; set; }

    [StringLength(1000)]
    public string? Note { get; set; }
}
