using MyoVisionID.Api.DTOs.Auth;

namespace MyoVisionID.Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
        Task<RefreshTokenResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request);
        Task<CurrentUserDto> GetMeAsync(long userId);
        Task ChangePasswordAsync(long userId, ChangePasswordDto request);
        Task ForgotPasswordAsync(ForgotPasswordDto request);
        Task ResetPasswordAsync(ResetPasswordDto request);
        Task LogoutAsync(string refreshToken);
    }
}
