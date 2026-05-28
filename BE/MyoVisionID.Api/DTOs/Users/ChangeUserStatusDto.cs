using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.Users;

public class ChangeUserStatusDto
{
    [Required]
    [RegularExpression(ValidationRegex.UserStatus)]
    public string Status { get; set; } = string.Empty;
}

