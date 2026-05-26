using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Authorization;
using MyoVisionID.Api.Common.Constants;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.Users;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }

        [HttpGet]
        [HasPermission(PermissionConstants.UsersView)]
        public async Task<IActionResult> GetAll()
        {
            return Ok(ApiResponse<object>.Ok(await _service.GetAllAsync()));
        }

        [HttpGet("{userId:long}")]
        [HasPermission(PermissionConstants.UsersView)]
        public async Task<IActionResult> GetById(long userId)
        {
            return Ok(ApiResponse<object>.Ok(await _service.GetByIdAsync(userId)));
        }

        [HttpPost]
        [HasPermission(PermissionConstants.UsersCreate)]
        public async Task<IActionResult> Create(CreateUserDto request)
        {
            return Ok(ApiResponse<object>.Ok(await _service.CreateAsync(request)));
        }

        [HttpPut("{userId:long}")]
        [HasPermission(PermissionConstants.UsersUpdate)]
        public async Task<IActionResult> Update(long userId, UpdateUserDto request)
        {
            return Ok(ApiResponse<object>.Ok(await _service.UpdateAsync(userId, request)));
        }

        [HttpPatch("{userId:long}/status")]
        [HasPermission(PermissionConstants.UsersUpdate)]
        public async Task<IActionResult> ChangeStatus(long userId, [FromQuery] string status)
        {
            await _service.ChangeStatusAsync(userId, status);

            return Ok(ApiResponse<string>.Ok("Status updated."));
        }

        [HttpDelete("{userId:long}")]
        [HasPermission(PermissionConstants.UsersDelete)]
        public async Task<IActionResult> Delete(long userId)
        {
            await _service.DeleteAsync(userId);

            return Ok(ApiResponse<string>.Ok("User deleted."));
        }

        [HttpPost("{userId:long}/roles")]
        [HasPermission(PermissionConstants.UserRolesManage)]
        public async Task<IActionResult> AssignRole(long userId, AssignRoleDto request)
        {
            await _service.AssignRoleAsync(userId, request.RoleId);

            return Ok(ApiResponse<string>.Ok("Role assigned."));
        }

        [HttpDelete("{userId:long}/roles/{roleId:long}")]
        [HasPermission(PermissionConstants.UserRolesManage)]
        public async Task<IActionResult> RemoveRole(long userId, long roleId)
        {
            await _service.RemoveRoleAsync(userId, roleId);

            return Ok(ApiResponse<string>.Ok("Role removed."));
        }

        [HttpGet("{userId:long}/permissions")]
        [HasPermission(PermissionConstants.PermissionsView)]
        public async Task<IActionResult> Permissions(long userId)
        {
            return Ok(ApiResponse<object>.Ok(await _service.GetPermissionsAsync(userId)));
        }
    }
}
