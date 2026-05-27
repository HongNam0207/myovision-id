using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Clinics;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class ClinicService : IClinicService
{
    private readonly AppDbContext _context;

    public ClinicService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ClinicResponseDto>> GetAllAsync()
    {
        return await _context.Clinics
            .Include(x => x.ManagerUser)
            .OrderBy(x => x.ClinicId)
            .Select(x => Map(x))
            .ToListAsync();
    }

    public async Task<ClinicResponseDto> GetByIdAsync(long clinicId)
    {
        var clinic = await _context.Clinics
            .Include(x => x.ManagerUser)
            .FirstOrDefaultAsync(x => x.ClinicId == clinicId);

        if (clinic == null)
            throw new KeyNotFoundException("Clinic not found.");

        return Map(clinic);
    }

    public async Task<ClinicResponseDto> CreateAsync(CreateClinicDto request)
    {
        var exists = await _context.Clinics.AnyAsync(x => x.ClinicCode == request.ClinicCode);
        if (exists)
            throw new InvalidOperationException("Clinic code already exists.");

        var clinic = new Clinic
        {
            ClinicCode = request.ClinicCode,
            ClinicName = request.ClinicName,
            Address = request.Address,
            Phone = request.Phone,
            Email = request.Email,
            ManagerUserId = request.ManagerUserId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Clinics.Add(clinic);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(clinic.ClinicId);
    }

    public async Task<ClinicResponseDto> UpdateAsync(long clinicId, UpdateClinicDto request)
    {
        var clinic = await _context.Clinics.FindAsync(clinicId);
        if (clinic == null)
            throw new KeyNotFoundException("Clinic not found.");

        clinic.ClinicName = request.ClinicName;
        clinic.Address = request.Address;
        clinic.Phone = request.Phone;
        clinic.Email = request.Email;
        clinic.ManagerUserId = request.ManagerUserId;
        clinic.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(clinicId);
    }

    public async Task ChangeStatusAsync(long clinicId, bool isActive)
    {
        var clinic = await _context.Clinics.FindAsync(clinicId);
        if (clinic == null)
            throw new KeyNotFoundException("Clinic not found.");

        clinic.IsActive = isActive;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(long clinicId)
    {
        await ChangeStatusAsync(clinicId, false);
    }

    private static ClinicResponseDto Map(Clinic clinic)
    {
        return new ClinicResponseDto
        {
            ClinicId = clinic.ClinicId,
            ClinicCode = clinic.ClinicCode,
            ClinicName = clinic.ClinicName,
            Address = clinic.Address,
            Phone = clinic.Phone,
            Email = clinic.Email,
            ManagerUserId = clinic.ManagerUserId,
            ManagerName = clinic.ManagerUser?.FullName,
            IsActive = clinic.IsActive ?? false,
            CreatedAt = clinic.CreatedAt
        };
    }
}
