using MyoVisionID.Api.DTOs.Permissions;
using MyoVisionID.Api.DTOs.Roles;

namespace MyoVisionID.Api.Services.Interfaces
{
    public interface IRoleService
    {
        Task<List<RoleResponseDto>> GetAllAsync();
        Task<RoleResponseDto> GetByIdAsync(long roleId);
        Task<RoleResponseDto> CreateAsync(CreateRoleDto request);
        Task<RoleResponseDto> UpdateAsync(long roleId, UpdateRoleDto request);
        Task ChangeStatusAsync(long roleId, bool isActive);
        Task DeleteAsync(long roleId);
        Task<List<PermissionResponseDto>> GetPermissionsAsync();
        Task AssignPermissionAsync(long roleId, long permissionId);
        Task RemovePermissionAsync(long roleId, long permissionId);
    }
}
