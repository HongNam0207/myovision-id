namespace MyoVisionID.Api.DTOs.Users
{
    public class UpdateUserDto
    {
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? AvatarUrl { get; set; }
        public string Status { get; set; } = "ACTIVE";
    }
}
