using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.Measurements;

public class CreateEyeRefractionDto
{
    [Required]
    [RegularExpression(ValidationRegex.EyeSide)]
    public string EyeSide { get; set; } = string.Empty;

    [Required]
    [RegularExpression(ValidationRegex.MeasurementType)]
    public string MeasurementType { get; set; } = string.Empty;

    [Range(-30, 30)]
    public decimal? Sph { get; set; }

    [Range(-15, 15)]
    public decimal? Cyl { get; set; }

    [Range(0, 180)]
    public int? AxisDegree { get; set; }

    [StringLength(50)]
    public string? Va { get; set; }

    [StringLength(50)]
    public string? Bcva { get; set; }

    [StringLength(1000)]
    public string? Note { get; set; }
}

