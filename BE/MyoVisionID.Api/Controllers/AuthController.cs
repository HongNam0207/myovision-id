using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.Auth;
using MyoVisionID.Api.Services.Interfaces;
using System.Security.Claims;

namespace MyoVisionID.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginRequestDto request)
        {
            return Ok(ApiResponse<object>.Ok(await _authService.LoginAsync(request)));
        }

        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public IActionResult RefreshToken()
        {
            return Ok(ApiResponse<object>.Ok(new
            {
                message = "Refresh token endpoint placeholder. Full refresh-token storage will be implemented after Group A security upgrade."
            }));
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(ApiResponse<object>.Ok(await _authService.GetMeAsync(userId)));
        }

        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto request)
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _authService.ChangePasswordAsync(userId, request);
            return Ok(ApiResponse<string>.Ok("Password changed successfully."));
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            return Ok(ApiResponse<string>.Ok("Logged out successfully."));
        }
    }
}


