using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.UserClinics;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class UserClinicService : IUserClinicService
{
    private readonly AppDbContext _context;

    public UserClinicService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserClinicResponseDto>> GetByUserAsync(long userId)
    {
        return await _context.UserClinics
            .Include(x => x.User)
            .Include(x => x.Clinic)
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.ClinicId)
            .Select(x => new UserClinicResponseDto
            {
                UserClinicId = x.UserClinicId,
                UserId = x.UserId,
                Username = x.User.Username,
                FullName = x.User.FullName,
                ClinicId = x.ClinicId,
                ClinicCode = x.Clinic.ClinicCode,
                ClinicName = x.Clinic.ClinicName,
                AssignedAt = x.AssignedAt
            })
            .ToListAsync();
    }

    public async Task AssignAsync(long userId, long clinicId)
    {
        var userExists = await _context.Users.AnyAsync(x => x.UserId == userId);
        if (!userExists)
            throw new KeyNotFoundException("User not found.");

        var clinicExists = await _context.Clinics.AnyAsync(x => x.ClinicId == clinicId);
        if (!clinicExists)
            throw new KeyNotFoundException("Clinic not found.");

        var exists = await _context.UserClinics.AnyAsync(x => x.UserId == userId && x.ClinicId == clinicId);
        if (exists)
            return;

        _context.UserClinics.Add(new UserClinic
        {
            UserId = userId,
            ClinicId = clinicId,
            AssignedAt = DateTime.UtcNow.AddHours(7)
        });

        await _context.SaveChangesAsync();
    }

    public async Task RemoveAsync(long userId, long clinicId)
    {
        var entity = await _context.UserClinics
            .FirstOrDefaultAsync(x => x.UserId == userId && x.ClinicId == clinicId);

        if (entity == null)
            return;

        _context.UserClinics.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> UserHasClinicAccessAsync(long userId, long clinicId)
    {
        var isAdmin = await _context.UserRoles
            .Include(x => x.Role)
            .AnyAsync(x => x.UserId == userId && x.Role.RoleCode == "ADMIN");

        if (isAdmin)
            return true;

        return await _context.UserClinics.AnyAsync(x => x.UserId == userId && x.ClinicId == clinicId);
    }
}

