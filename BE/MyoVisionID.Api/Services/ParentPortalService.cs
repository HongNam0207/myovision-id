using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Parents;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class ParentPortalService : IParentPortalService
{
    private readonly AppDbContext _context;

    public ParentPortalService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ParentCanAccessPatientAsync(long parentUserId, long patientId)
    {
        return await _context.PatientParents
            .Include(x => x.Parent)
            .AnyAsync(x =>
                x.PatientId == patientId &&
                x.CanLogin == true &&
                x.Parent.UserId == parentUserId);
    }

    public async Task<List<ParentResponseDto>> GetPatientParentsAsync(long patientId)
    {
        return await _context.PatientParents
            .Include(x => x.Parent)
            .Where(x => x.PatientId == patientId)
            .Select(x => new ParentResponseDto
            {
                ParentId = x.Parent.ParentId,
                UserId = x.Parent.UserId,
                FullName = x.Parent.FullName,
                Relationship = x.Parent.Relationship,
                Phone = x.Parent.Phone,
                Email = x.Parent.Email,
                Address = x.Parent.Address,
                IdentityNumber = x.Parent.IdentityNumber
            })
            .ToListAsync();
    }
}
