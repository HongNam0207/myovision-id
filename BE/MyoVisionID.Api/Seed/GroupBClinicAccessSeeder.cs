using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.Entities;

namespace MyoVisionID.Api.Seed;

public static class GroupBClinicAccessSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var clinic = await context.Clinics.FirstOrDefaultAsync(x => x.ClinicCode == "DONGDO_EYE");
        if (clinic == null) return;

        var usernames = new[] { "doctor01", "optometrist01", "nurse01", "parent01", "parent02" };

        var users = await context.Users
            .Where(x => usernames.Contains(x.Username))
            .ToListAsync();

        foreach (var user in users)
        {
            var exists = await context.UserClinics
                .AnyAsync(x => x.UserId == user.UserId && x.ClinicId == clinic.ClinicId);

            if (!exists)
            {
                context.UserClinics.Add(new UserClinic
                {
                    UserId = user.UserId,
                    ClinicId = clinic.ClinicId,
                    AssignedAt = DateTime.UtcNow
                });
            }
        }

        await context.SaveChangesAsync();
    }
}
