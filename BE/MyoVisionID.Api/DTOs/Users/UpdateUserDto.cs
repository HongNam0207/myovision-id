using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;
using MyoVisionID.Api.Common.Validation;

namespace MyoVisionID.Api.DTOs.Users;

public class UpdateUserDto
{
    [EmailAddress]
    [StringLength(255)]
    public string? Email { get; set; }

    [RegularExpression(ValidationRegex.PhoneVN)]
    public string? Phone { get; set; }

    [Required]
    [StringLength(150, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [RegularExpression(ValidationRegex.Gender)]
    public string? Gender { get; set; }

    [NotFutureDate]
    public DateTime? DateOfBirth { get; set; }

    [StringLength(500)]
    public string? AvatarUrl { get; set; }

    [Required]
    [RegularExpression(ValidationRegex.UserStatus)]
    public string Status { get; set; } = "ACTIVE";

    public List<long> RoleIds { get; set; } = new();
}

