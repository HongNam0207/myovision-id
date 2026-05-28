using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Common.Constants;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.Entities;

namespace MyoVisionID.Api.Seed
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // await context.Database.MigrateAsync();
            await context.Database.EnsureCreatedAsync();

            if (!await context.Roles.AnyAsync())
            {
                context.Roles.AddRange(
                    new Role { RoleCode = RoleConstants.Admin, RoleName = "Admin", Description = "Quan tri toan bo he thong", IsActive = true, CreatedAt = DateTime.UtcNow.AddHours(7) },
                    new Role { RoleCode = RoleConstants.Ophthalmologist, RoleName = "Bac si nhan khoa", Description = "Chan doan va lap phac do", IsActive = true, CreatedAt = DateTime.UtcNow.AddHours(7) },
                    new Role { RoleCode = RoleConstants.Optometrist, RoleName = "Khuc xa nhan khoa", Description = "Nhap thong so do mat", IsActive = true, CreatedAt = DateTime.UtcNow.AddHours(7) },
                    new Role { RoleCode = RoleConstants.Nurse, RoleName = "Dieu duong", Description = "Tiep nhan va quan ly hanh chinh", IsActive = true, CreatedAt = DateTime.UtcNow.AddHours(7) },
                    new Role { RoleCode = RoleConstants.Parent, RoleName = "Phu huynh", Description = "Theo doi thong tin cua con", IsActive = true, CreatedAt = DateTime.UtcNow.AddHours(7) }
                );

                await context.SaveChangesAsync();
            }

            var permissions = new[]
            {
                PermissionConstants.UsersView,
                PermissionConstants.UsersCreate,
                PermissionConstants.UsersUpdate,
                PermissionConstants.UsersDelete,
                PermissionConstants.RolesView,
                PermissionConstants.RolesCreate,
                PermissionConstants.RolesUpdate,
                PermissionConstants.RolesDelete,
                PermissionConstants.PermissionsView,
                PermissionConstants.RolePermissionsManage,
                PermissionConstants.UserRolesManage
            };

            foreach (var code in permissions)
            {
                if (!await context.Permissions.AnyAsync(x => x.PermissionCode == code))
                {
                    context.Permissions.Add(new Permission
                    {
                        PermissionCode = code,
                        PermissionName = code,
                        ModuleName = code.Contains(".") ? code.Split('.')[0] : "System",
                        Description = code
                    });
                }
            }

            await context.SaveChangesAsync();

            var adminRole = await context.Roles.FirstAsync(x => x.RoleCode == RoleConstants.Admin);
            var allPermissions = await context.Permissions.ToListAsync();

            foreach (var permission in allPermissions)
            {
                if (!await context.RolePermissions.AnyAsync(x => x.RoleId == adminRole.RoleId && x.PermissionId == permission.PermissionId))
                {
                    context.RolePermissions.Add(new RolePermission
                    {
                        RoleId = adminRole.RoleId,
                        PermissionId = permission.PermissionId
                    });
                }
            }

            await context.SaveChangesAsync();

            await SeedUser(context, "admin", "admin@myovision.vn", "Admin MYOVISION ID", RoleConstants.Admin);
            await SeedUser(context, "doctor01", "doctor01@myovision.vn", "BS. Nguyen Minh Anh", RoleConstants.Ophthalmologist);
            await SeedUser(context, "optometrist01", "optometrist01@myovision.vn", "KTV Khuc xa Tran Quoc Huy", RoleConstants.Optometrist);
            await SeedUser(context, "nurse01", "nurse01@myovision.vn", "Dieu duong Le Thu Ha", RoleConstants.Nurse);
            await SeedUser(context, "parent01", "parent01@gmail.com", "Phu huynh Nguyen Van Nam", RoleConstants.Parent);
        }

        private static async Task SeedUser(AppDbContext context, string username, string email, string fullName, string roleCode)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Username == username);

            if (user == null)
            {
                user = new User
                {
                    Username = username,
                    Email = email,
                    Phone = "0900000000",
                    PasswordHash = "123456",
                    FullName = fullName,
                    Gender = "Nam",
                    Status = "ACTIVE",
                    CreatedAt = DateTime.UtcNow.AddHours(7)
                };

                context.Users.Add(user);
                await context.SaveChangesAsync();
            }

            var role = await context.Roles.FirstAsync(x => x.RoleCode == roleCode);

            if (!await context.UserRoles.AnyAsync(x => x.UserId == user.UserId && x.RoleId == role.RoleId))
            {
                context.UserRoles.Add(new UserRole
                {
                    UserId = user.UserId,
                    RoleId = role.RoleId,
                    AssignedAt = DateTime.UtcNow.AddHours(7)
                });

                await context.SaveChangesAsync();
            }
        }
    }
}

