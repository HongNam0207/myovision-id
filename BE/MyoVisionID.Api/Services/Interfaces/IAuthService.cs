using MyoVisionID.Api.DTOs.Auth;

namespace MyoVisionID.Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);

        Task<CurrentUserDto?> GetCurrentUserAsync(long userId);
    }
}