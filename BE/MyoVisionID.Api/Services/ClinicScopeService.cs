using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class ClinicScopeService : IClinicScopeService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public ClinicScopeService(AppDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<bool> CanAccessClinicAsync(long clinicId)
    {
        if (_currentUser.IsInRole("ADMIN"))
            return true;

        return await _context.UserClinics
            .AnyAsync(x => x.UserId == _currentUser.UserId && x.ClinicId == clinicId);
    }

    public async Task<List<long>> GetAccessibleClinicIdsAsync()
    {
        if (_currentUser.IsInRole("ADMIN"))
        {
            return await _context.Clinics
                .Where(x => x.IsActive == true)
                .Select(x => x.ClinicId)
                .ToListAsync();
        }

        return await _context.UserClinics
            .Where(x => x.UserId == _currentUser.UserId)
            .Select(x => x.ClinicId)
            .ToListAsync();
    }
}

