using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.Parents;

public class UpdateParentDto
{
    [Required]
    [StringLength(150, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [RegularExpression(ValidationRegex.Relationship)]
    public string? Relationship { get; set; }

    [Required]
    [RegularExpression(ValidationRegex.PhoneVN)]
    public string Phone { get; set; } = string.Empty;

    [EmailAddress]
    [StringLength(255)]
    public string? Email { get; set; }

    [StringLength(500)]
    public string? Address { get; set; }

    [StringLength(50)]
    public string? IdentityNumber { get; set; }
}

