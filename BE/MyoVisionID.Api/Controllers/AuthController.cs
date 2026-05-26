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
        public async Task<IActionResult> Login(LoginRequestDto request)
        {
            var result = await _authService.LoginAsync(request);

            if (result == null)
            {
                return Unauthorized(
                    ApiResponse<string>.Fail("Invalid username or password"));
            }

            return Ok(ApiResponse<LoginResponseDto>.Ok(result));
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(
                    ApiResponse<string>.Fail("Unauthorized"));
            }

            var userId = long.Parse(userIdClaim.Value);

            var result = await _authService.GetCurrentUserAsync(userId);

            if (result == null)
            {
                return NotFound(
                    ApiResponse<string>.Fail("User not found"));
            }

            return Ok(ApiResponse<CurrentUserDto>.Ok(result));
        }
    }
}