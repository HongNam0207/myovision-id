namespace MyoVisionID.Api.DTOs.Users
{
    public class CreateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public List<long> RoleIds { get; set; } = new();
    }
}
