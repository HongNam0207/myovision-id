using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class PatientParentService : IPatientParentService
{
    private readonly AppDbContext _context;

    public PatientParentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task AssignAsync(long patientId, long parentId, bool isPrimaryContact, bool canLogin)
    {
        var patientExists = await _context.Patients.AnyAsync(x => x.PatientId == patientId);
        if (!patientExists)
            throw new KeyNotFoundException("Patient not found.");

        var parentExists = await _context.Parents.AnyAsync(x => x.ParentId == parentId);
        if (!parentExists)
            throw new KeyNotFoundException("Parent not found.");

        var exists = await _context.PatientParents
            .AnyAsync(x => x.PatientId == patientId && x.ParentId == parentId);

        if (exists)
            return;

        _context.PatientParents.Add(new PatientParent
        {
            PatientId = patientId,
            ParentId = parentId,
            IsPrimaryContact = isPrimaryContact,
            CanLogin = canLogin,
            CreatedAt = DateTime.UtcNow.AddHours(7)
        });

        await _context.SaveChangesAsync();
    }

    public async Task RemoveAsync(long patientId, long parentId)
    {
        var link = await _context.PatientParents
            .FirstOrDefaultAsync(x => x.PatientId == patientId && x.ParentId == parentId);

        if (link == null)
            return;

        _context.PatientParents.Remove(link);
        await _context.SaveChangesAsync();
    }
}

