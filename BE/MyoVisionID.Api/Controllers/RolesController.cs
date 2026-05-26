using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Authorization;
using MyoVisionID.Api.Common.Constants;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.Roles;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers
{
    [ApiController]
    [Route("api/roles")]
    [Authorize]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _service;

        public RolesController(IRoleService service)
        {
            _service = service;
        }

        [HttpGet]
        [HasPermission(PermissionConstants.RolesView)]
        public async Task<IActionResult> GetAll()
        {
            return Ok(ApiResponse<object>.Ok(await _service.GetAllAsync()));
        }

        [HttpGet("{roleId:long}")]
        [HasPermission(PermissionConstants.RolesView)]
        public async Task<IActionResult> GetById(long roleId)
        {
            return Ok(ApiResponse<object>.Ok(await _service.GetByIdAsync(roleId)));
        }

        [HttpPost]
        [HasPermission(PermissionConstants.RolesCreate)]
        public async Task<IActionResult> Create(CreateRoleDto request)
        {
            return Ok(ApiResponse<object>.Ok(await _service.CreateAsync(request)));
        }

        [HttpPut("{roleId:long}")]
        [HasPermission(PermissionConstants.RolesUpdate)]
        public async Task<IActionResult> Update(long roleId, UpdateRoleDto request)
        {
            return Ok(ApiResponse<object>.Ok(await _service.UpdateAsync(roleId, request)));
        }

        [HttpPatch("{roleId:long}/status")]
        [HasPermission(PermissionConstants.RolesUpdate)]
        public async Task<IActionResult> ChangeStatus(long roleId, [FromQuery] bool isActive)
        {
            await _service.ChangeStatusAsync(roleId, isActive);

            return Ok(ApiResponse<string>.Ok("Role status updated."));
        }

        [HttpDelete("{roleId:long}")]
        [HasPermission(PermissionConstants.RolesDelete)]
        public async Task<IActionResult> Delete(long roleId)
        {
            await _service.DeleteAsync(roleId);

            return Ok(ApiResponse<string>.Ok("Role deleted."));
        }

        [HttpGet("/api/permissions")]
        [HasPermission(PermissionConstants.PermissionsView)]
        public async Task<IActionResult> Permissions()
        {
            return Ok(ApiResponse<object>.Ok(await _service.GetPermissionsAsync()));
        }

        [HttpPost("{roleId:long}/permissions")]
        [HasPermission(PermissionConstants.RolePermissionsManage)]
        public async Task<IActionResult> AssignPermission(long roleId, AssignPermissionDto request)
        {
            await _service.AssignPermissionAsync(roleId, request.PermissionId);

            return Ok(ApiResponse<string>.Ok("Permission assigned."));
        }

        [HttpDelete("{roleId:long}/permissions/{permissionId:long}")]
        [HasPermission(PermissionConstants.RolePermissionsManage)]
        public async Task<IActionResult> RemovePermission(long roleId, long permissionId)
        {
            await _service.RemovePermissionAsync(roleId, permissionId);

            return Ok(ApiResponse<string>.Ok("Permission removed."));
        }
    }
}
