using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.Clinics;

public class CreateClinicDto
{
    [Required]
    [StringLength(50, MinimumLength = 2)]
    [RegularExpression(ValidationRegex.Code)]
    public string ClinicCode { get; set; } = string.Empty;

    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string ClinicName { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Address { get; set; }

    [RegularExpression(ValidationRegex.PhoneVN)]
    public string? Phone { get; set; }

    [EmailAddress]
    [StringLength(255)]
    public string? Email { get; set; }

    [Range(1, long.MaxValue)]
    public long? ManagerUserId { get; set; }
}
