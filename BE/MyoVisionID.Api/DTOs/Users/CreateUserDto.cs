using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;
using MyoVisionID.Api.Common.Validation;

namespace MyoVisionID.Api.DTOs.Users;

public class CreateUserDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

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
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    public List<long> RoleIds { get; set; } = new();
}
