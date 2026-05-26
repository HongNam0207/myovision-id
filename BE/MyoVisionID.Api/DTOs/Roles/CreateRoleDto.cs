namespace MyoVisionID.Api.DTOs.Roles
{
    public class CreateRoleDto
    {
        public string RoleCode { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
