using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Auth;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            var user = await _context.Users
                .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                .FirstOrDefaultAsync(x =>
                    x.Username == request.UsernameOrEmail ||
                    x.Email == request.UsernameOrEmail);

            if (user == null || user.PasswordHash != request.Password || user.Status != "ACTIVE")
                throw new UnauthorizedAccessException("Invalid username/email or password.");

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var roles = user.UserRoles.Select(x => x.Role.RoleCode).ToList();
            var permissions = await GetPermissionCodesAsync(user.UserId);

            return new LoginResponseDto
            {
                UserId = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                Roles = roles,
                Permissions = permissions,
                AccessToken = GenerateAccessToken(user.UserId, user.Username, roles, permissions)
            };
        }

        public async Task<CurrentUserDto> GetMeAsync(long userId)
        {
            var user = await _context.Users
                .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (user == null)
                throw new KeyNotFoundException("User not found.");

            return new CurrentUserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,
                Roles = user.UserRoles.Select(x => x.Role.RoleCode).ToList(),
                Permissions = await GetPermissionCodesAsync(user.UserId)
            };
        }

        public async Task ChangePasswordAsync(long userId, ChangePasswordDto request)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                throw new KeyNotFoundException("User not found.");

            if (user.PasswordHash != request.CurrentPassword)
                throw new UnauthorizedAccessException("Current password is incorrect.");

            user.PasswordHash = request.NewPassword;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        private async Task<List<string>> GetPermissionCodesAsync(long userId)
        {
            return await (
                from ur in _context.UserRoles
                join rp in _context.RolePermissions on ur.RoleId equals rp.RoleId
                join p in _context.Permissions on rp.PermissionId equals p.PermissionId
                where ur.UserId == userId
                select p.PermissionCode
            ).Distinct().ToListAsync();
        }

        private string GenerateAccessToken(long userId, string username, List<string> roles, List<string> permissions)
        {
            var key = _configuration["Jwt:Key"] ?? "MyoVisionID_Development_Key_Change_This_At_Least_32_Characters";
            var issuer = _configuration["Jwt:Issuer"] ?? "MyoVisionID";
            var audience = _configuration["Jwt:Audience"] ?? "MyoVisionIDClient";

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, userId.ToString()),
                new(ClaimTypes.Name, username)
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            claims.AddRange(permissions.Select(permission => new Claim("permission", permission)));

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
