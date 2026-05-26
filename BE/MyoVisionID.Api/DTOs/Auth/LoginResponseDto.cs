namespace MyoVisionID.Api.DTOs.Auth
{
    public class LoginResponseDto
    {
        public long UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new();
        public List<string> Permissions { get; set; } = new();
    }
}
