namespace MyoVisionID.Api.DTOs.Auth
{
    public class ResetPasswordDto
    {
        public string UsernameOrEmail { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
