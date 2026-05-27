using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Parents;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class ParentService : IParentService
{
    private readonly AppDbContext _context;

    public ParentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ParentResponseDto>> GetAllAsync()
    {
        return await _context.Parents
            .OrderByDescending(x => x.ParentId)
            .Select(x => Map(x))
            .ToListAsync();
    }

    public async Task<ParentResponseDto> GetByIdAsync(long parentId)
    {
        var parent = await _context.Parents.FirstOrDefaultAsync(x => x.ParentId == parentId);

        if (parent == null)
            throw new KeyNotFoundException("Parent not found.");

        return Map(parent);
    }

    public async Task<ParentResponseDto> CreateAsync(CreateParentDto request)
    {
        var parent = new Parent
        {
            FullName = request.FullName,
            Relationship = request.Relationship,
            Phone = request.Phone,
            Email = request.Email,
            Address = request.Address,
            IdentityNumber = request.IdentityNumber,
            CreatedAt = DateTime.UtcNow
        };

        _context.Parents.Add(parent);
        await _context.SaveChangesAsync();

        return Map(parent);
    }

    public async Task<ParentResponseDto> UpdateAsync(long parentId, UpdateParentDto request)
    {
        var parent = await _context.Parents.FindAsync(parentId);

        if (parent == null)
            throw new KeyNotFoundException("Parent not found.");

        parent.FullName = request.FullName;
        parent.Relationship = request.Relationship;
        parent.Phone = request.Phone;
        parent.Email = request.Email;
        parent.Address = request.Address;
        parent.IdentityNumber = request.IdentityNumber;

        await _context.SaveChangesAsync();

        return Map(parent);
    }

    private static ParentResponseDto Map(Parent parent)
    {
        return new ParentResponseDto
        {
            ParentId = parent.ParentId,
            UserId = parent.UserId,
            FullName = parent.FullName,
            Relationship = parent.Relationship,
            Phone = parent.Phone,
            Email = parent.Email,
            Address = parent.Address,
            IdentityNumber = parent.IdentityNumber
        };
    }
}
