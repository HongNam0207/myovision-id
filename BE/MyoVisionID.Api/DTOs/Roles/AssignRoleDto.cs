using System.ComponentModel.DataAnnotations;

namespace MyoVisionID.Api.DTOs.Roles;

public class AssignRoleDto
{
    [Range(1, long.MaxValue)]
    public long RoleId { get; set; }
}
