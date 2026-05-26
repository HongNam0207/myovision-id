namespace MyoVisionID.Api.DTOs.Permissions
{
    public class PermissionResponseDto
    {
        public long PermissionId { get; set; }

        public string PermissionCode { get; set; } = string.Empty;

        public string PermissionName { get; set; } = string.Empty;

        public string? ModuleName { get; set; }

        public string? Description { get; set; }
    }
}
