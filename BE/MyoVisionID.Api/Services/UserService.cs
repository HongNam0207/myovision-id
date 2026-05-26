using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Users;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserResponseDto>> GetAllAsync()
        {
            return await _context.Users
                .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                .Select(x => MapUser(x))
                .ToListAsync();
        }

        public async Task<UserResponseDto> GetByIdAsync(long userId)
        {
            var user = await _context.Users
                .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (user == null)
                throw new KeyNotFoundException("User not found.");

            return MapUser(user);
        }

        public async Task<UserResponseDto> CreateAsync(CreateUserDto request)
        {
            var exists = await _context.Users.AnyAsync(x =>
                x.Username == request.Username || x.Email == request.Email);

            if (exists)
                throw new InvalidOperationException("Username or email already exists.");

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                Phone = request.Phone,
                PasswordHash = request.Password,
                FullName = request.FullName,
                Gender = request.Gender,
                DateOfBirth = request.DateOfBirth.HasValue ? DateOnly.FromDateTime(request.DateOfBirth.Value) : null,
                Status = "ACTIVE",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            foreach (var roleId in request.RoleIds.Distinct())
            {
                _context.UserRoles.Add(new UserRole
                {
                    UserId = user.UserId,
                    RoleId = roleId,
                    AssignedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();

            return await GetByIdAsync(user.UserId);
        }

        public async Task<UserResponseDto> UpdateAsync(long userId, UpdateUserDto request)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                throw new KeyNotFoundException("User not found.");

            user.Email = request.Email;
            user.Phone = request.Phone;
            user.FullName = request.FullName;
            user.Gender = request.Gender;
            user.DateOfBirth = request.DateOfBirth.HasValue ? DateOnly.FromDateTime(request.DateOfBirth.Value) : null;
            user.AvatarUrl = request.AvatarUrl;
            user.Status = request.Status;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(userId);
        }

        public async Task ChangeStatusAsync(long userId, string status)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                throw new KeyNotFoundException("User not found.");

            user.Status = status;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(long userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                throw new KeyNotFoundException("User not found.");

            user.Status = "DELETED";
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public async Task AssignRoleAsync(long userId, long roleId)
        {
            var exists = await _context.UserRoles.AnyAsync(x => x.UserId == userId && x.RoleId == roleId);

            if (exists)
                return;

            _context.UserRoles.Add(new UserRole
            {
                UserId = userId,
                RoleId = roleId,
                AssignedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
        }

        public async Task RemoveRoleAsync(long userId, long roleId)
        {
            var entity = await _context.UserRoles
                .FirstOrDefaultAsync(x => x.UserId == userId && x.RoleId == roleId);

            if (entity == null)
                return;

            _context.UserRoles.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<UserPermissionResponseDto> GetPermissionsAsync(long userId)
        {
            var user = await _context.Users
                .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (user == null)
                throw new KeyNotFoundException("User not found.");

            var permissions = await (
                from ur in _context.UserRoles
                join rp in _context.RolePermissions on ur.RoleId equals rp.RoleId
                join p in _context.Permissions on rp.PermissionId equals p.PermissionId
                where ur.UserId == userId
                select p.PermissionCode
            ).Distinct().ToListAsync();

            return new UserPermissionResponseDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Roles = user.UserRoles.Select(x => x.Role.RoleCode).ToList(),
                Permissions = permissions
            };
        }

        private static UserResponseDto MapUser(User user)
        {
            return new UserResponseDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                Phone = user.Phone,
                FullName = user.FullName,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth.HasValue ? user.DateOfBirth.Value.ToDateTime(TimeOnly.MinValue) : null,
                AvatarUrl = user.AvatarUrl,
                Status = user.Status ?? string.Empty,
                LastLoginAt = user.LastLoginAt,
                CreatedAt = user.CreatedAt,
                Roles = user.UserRoles.Select(x => x.Role.RoleCode).ToList()
            };
        }
    }
}
