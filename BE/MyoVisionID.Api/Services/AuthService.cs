using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Auth;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

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
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                        .ThenInclude(r => r.RolePermissions)
                            .ThenInclude(rp => rp.Permission)
                .FirstOrDefaultAsync(u =>
                    u.Username == request.UsernameOrEmail ||
                    u.Email == request.UsernameOrEmail);

            if (user == null || user.PasswordHash != request.Password)
                throw new UnauthorizedAccessException("Invalid username/email or password");

            if (user.Status != "ACTIVE")
                throw new UnauthorizedAccessException("User account is not active");

            user.LastLoginAt = DateTime.UtcNow;

            var accessToken = GenerateAccessToken(user);
            var refreshToken = await CreateRefreshTokenAsync(user.UserId);

            await _context.SaveChangesAsync();

            return new LoginResponseDto
            {
                UserId = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token,
                Roles = user.UserRoles.Select(x => x.Role.RoleCode).ToList(),
                Permissions = user.UserRoles
                    .SelectMany(x => x.Role.RolePermissions)
                    .Select(x => x.Permission.PermissionCode)
                    .Distinct()
                    .ToList()
            };
        }

        public async Task<RefreshTokenResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request)
        {
            var refreshToken = await _context.RefreshTokens
                .Include(x => x.User)
                    .ThenInclude(u => u.UserRoles)
                        .ThenInclude(ur => ur.Role)
                            .ThenInclude(r => r.RolePermissions)
                                .ThenInclude(rp => rp.Permission)
                .FirstOrDefaultAsync(x => x.Token == request.RefreshToken);

            if (refreshToken == null || refreshToken.IsRevoked || refreshToken.ExpiredAt <= DateTime.UtcNow)
                throw new UnauthorizedAccessException("Invalid refresh token");

            if (refreshToken.User.Status != "ACTIVE")
                throw new UnauthorizedAccessException("User account is not active");

            refreshToken.IsRevoked = true;
            refreshToken.RevokedAt = DateTime.UtcNow;

            var newRefreshToken = await CreateRefreshTokenAsync(refreshToken.UserId);
            var newAccessToken = GenerateAccessToken(refreshToken.User);

            await _context.SaveChangesAsync();

            return new RefreshTokenResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken.Token
            };
        }

        public async Task<CurrentUserDto> GetMeAsync(long userId)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                        .ThenInclude(r => r.RolePermissions)
                            .ThenInclude(rp => rp.Permission)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                throw new KeyNotFoundException("User not found");

            return new CurrentUserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                Roles = user.UserRoles.Select(x => x.Role.RoleCode).ToList(),
                Permissions = user.UserRoles
                    .SelectMany(x => x.Role.RolePermissions)
                    .Select(x => x.Permission.PermissionCode)
                    .Distinct()
                    .ToList()
            };
        }

        public async Task ChangePasswordAsync(long userId, ChangePasswordDto request)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                throw new KeyNotFoundException("User not found");

            if (user.PasswordHash != request.CurrentPassword)
                throw new UnauthorizedAccessException("Old password is incorrect");

            user.PasswordHash = request.NewPassword;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public Task ForgotPasswordAsync(ForgotPasswordDto request)
        {
            return Task.CompletedTask;
        }

        public async Task ResetPasswordAsync(ResetPasswordDto request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.UsernameOrEmail || u.Email == request.UsernameOrEmail);

            if (user == null)
                throw new KeyNotFoundException("User not found");

            user.PasswordHash = request.NewPassword;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public async Task LogoutAsync(string refreshToken)
        {
            var token = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == refreshToken);

            if (token == null)
                return;

            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        private async Task<RefreshToken> CreateRefreshTokenAsync(long userId)
        {
            var token = new RefreshToken
            {
                UserId = userId,
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                ExpiredAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow
            };

            await _context.RefreshTokens.AddAsync(token);
            return token;
        }

        private string GenerateAccessToken(User user)
        {
            var jwt = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            foreach (var role in user.UserRoles.Select(x => x.Role.RoleCode))
                claims.Add(new Claim(ClaimTypes.Role, role));

            foreach (var permission in user.UserRoles
                .SelectMany(x => x.Role.RolePermissions)
                .Select(x => x.Permission.PermissionCode)
                .Distinct())
            {
                claims.Add(new Claim("permission", permission));
            }

            var token = new JwtSecurityToken(
                issuer: jwt["Issuer"],
                audience: jwt["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwt["ExpireMinutes"] ?? "60")),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

