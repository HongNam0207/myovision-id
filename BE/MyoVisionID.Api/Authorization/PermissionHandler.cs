using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;

namespace MyoVisionID.Api.Authorization
{
    public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly AppDbContext _context;

        public PermissionHandler(AppDbContext context)
        {
            _context = context;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement)
        {
            var userIdValue = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!long.TryParse(userIdValue, out var userId))
                return;

            var hasPermission = await (
                from ur in _context.UserRoles
                join rp in _context.RolePermissions on ur.RoleId equals rp.RoleId
                join p in _context.Permissions on rp.PermissionId equals p.PermissionId
                join r in _context.Roles on ur.RoleId equals r.RoleId
                where ur.UserId == userId
                      && r.IsActive == true
                      && p.PermissionCode == requirement.Permission
                select p.PermissionId
            ).AnyAsync();

            if (hasPermission)
                context.Succeed(requirement);
        }
    }
}
