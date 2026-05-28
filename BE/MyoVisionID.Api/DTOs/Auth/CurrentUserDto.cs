namespace MyoVisionID.Api.DTOs.Auth
{
    public class CurrentUserDto
    {
        public long UserId { get; set; }

        public string Username { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public List<string> Roles { get; set; } = new();

        public List<string> Permissions { get; set; } = new();
    }
}
