using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Auth;
using MyoVisionID.Api.Helpers;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(
            AppDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x =>
                    x.Username == request.UsernameOrEmail ||
                    x.Email == request.UsernameOrEmail);

            if (user == null)
                return null;

            if (user.Status != "ACTIVE")
                return null;

            var isValidPassword = PasswordHelper.VerifyPassword(
                request.Password,
                user.PasswordHash);

            if (!isValidPassword)
                return null;

            var roles = await (
                from ur in _context.UserRoles
                join r in _context.Roles
                    on ur.RoleId equals r.RoleId
                where ur.UserId == user.UserId
                select r.RoleCode
            ).ToListAsync();

            var jwtKey = _configuration["Jwt:Key"]!;

            var token = JwtHelper.GenerateToken(
                user.UserId,
                user.Username,
                user.FullName,
                roles,
                jwtKey);

            user.LastLoginAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new LoginResponseDto
            {
                UserId = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                AccessToken = token,
                Roles = roles
            };
        }

        public async Task<CurrentUserDto?> GetCurrentUserAsync(long userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (user == null)
                return null;

            var roles = await (
                from ur in _context.UserRoles
                join r in _context.Roles
                    on ur.RoleId equals r.RoleId
                where ur.UserId == user.UserId
                select r.RoleCode
            ).ToListAsync();

            return new CurrentUserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email ?? "",
                Roles = roles
            };
        }
    }
}