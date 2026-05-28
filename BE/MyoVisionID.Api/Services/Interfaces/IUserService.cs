using MyoVisionID.Api.DTOs.Users;

namespace MyoVisionID.Api.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<UserResponseDto>> GetAllAsync();
        Task<UserResponseDto> GetByIdAsync(long userId);
        Task<UserResponseDto> CreateAsync(CreateUserDto request);
        Task<UserResponseDto> UpdateAsync(long userId, UpdateUserDto request);
        Task ChangeStatusAsync(long userId, string status);
        Task DeleteAsync(long userId);
        Task AssignRoleAsync(long userId, long roleId);
        Task RemoveRoleAsync(long userId, long roleId);
        Task<UserPermissionResponseDto> GetPermissionsAsync(long userId);
    }
}

