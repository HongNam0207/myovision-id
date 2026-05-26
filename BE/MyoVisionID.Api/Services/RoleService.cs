using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Permissions;
using MyoVisionID.Api.DTOs.Roles;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services
{
    public class RoleService : IRoleService
    {
        private readonly AppDbContext _context;

        public RoleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<RoleResponseDto>> GetAllAsync()
        {
            return await _context.Roles
                .Select(x => new RoleResponseDto
                {
                    RoleId = x.RoleId,
                    RoleCode = x.RoleCode,
                    RoleName = x.RoleName,
                    Description = x.Description,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<RoleResponseDto> GetByIdAsync(long roleId)
        {
            var role = await _context.Roles.FindAsync(roleId);

            if (role == null)
                throw new KeyNotFoundException("Role not found.");

            return new RoleResponseDto
            {
                RoleId = role.RoleId,
                RoleCode = role.RoleCode,
                RoleName = role.RoleName,
                Description = role.Description,
                IsActive = role.IsActive,
                CreatedAt = role.CreatedAt
            };
        }

        public async Task<RoleResponseDto> CreateAsync(CreateRoleDto request)
        {
            var exists = await _context.Roles.AnyAsync(x => x.RoleCode == request.RoleCode);

            if (exists)
                throw new InvalidOperationException("Role code already exists.");

            var role = new Role
            {
                RoleCode = request.RoleCode,
                RoleName = request.RoleName,
                Description = request.Description,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(role.RoleId);
        }

        public async Task<RoleResponseDto> UpdateAsync(long roleId, UpdateRoleDto request)
        {
            var role = await _context.Roles.FindAsync(roleId);

            if (role == null)
                throw new KeyNotFoundException("Role not found.");

            role.RoleName = request.RoleName;
            role.Description = request.Description;
            role.IsActive = request.IsActive;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(roleId);
        }

        public async Task ChangeStatusAsync(long roleId, bool isActive)
        {
            var role = await _context.Roles.FindAsync(roleId);

            if (role == null)
                throw new KeyNotFoundException("Role not found.");

            role.IsActive = isActive;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(long roleId)
        {
            var role = await _context.Roles.FindAsync(roleId);

            if (role == null)
                throw new KeyNotFoundException("Role not found.");

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
        }

        public async Task<List<PermissionResponseDto>> GetPermissionsAsync()
        {
            return await _context.Permissions
                .Select(x => new PermissionResponseDto
                {
                    PermissionId = x.PermissionId,
                    PermissionCode = x.PermissionCode,
                    PermissionName = x.PermissionName,
                    ModuleName = x.ModuleName,
                    Description = x.Description
                })
                .ToListAsync();
        }

        public async Task AssignPermissionAsync(long roleId, long permissionId)
        {
            var exists = await _context.RolePermissions
                .AnyAsync(x => x.RoleId == roleId && x.PermissionId == permissionId);

            if (exists)
                return;

            _context.RolePermissions.Add(new RolePermission
            {
                RoleId = roleId,
                PermissionId = permissionId
            });

            await _context.SaveChangesAsync();
        }

        public async Task RemovePermissionAsync(long roleId, long permissionId)
        {
            var entity = await _context.RolePermissions
                .FirstOrDefaultAsync(x => x.RoleId == roleId && x.PermissionId == permissionId);

            if (entity == null)
                return;

            _context.RolePermissions.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
