namespace MyoVisionID.Api.DTOs.Users
{
    public class UserResponseDto
    {
        public long UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? AvatarUrl { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? LastLoginAt { get; set; }
        public DateTime? CreatedAt { get; set; }
        public List<string> Roles { get; set; } = new();
    }
}
