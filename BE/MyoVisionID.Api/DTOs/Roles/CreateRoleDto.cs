using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.Roles;

public class CreateRoleDto
{
    [Required]
    [RegularExpression(ValidationRegex.RoleCode)]
    public string RoleCode { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string RoleName { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }
}

