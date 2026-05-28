namespace MyoVisionID.Api.DTOs.Roles
{
    public class RoleResponseDto
    {
        public long RoleId { get; set; }

        public string RoleCode { get; set; } = string.Empty;

        public string RoleName { get; set; } = string.Empty;

        public string? Description { get; set; }

        public bool? IsActive { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}

