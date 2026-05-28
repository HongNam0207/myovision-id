using MyoVisionID.Api.DTOs.Clinics;

namespace MyoVisionID.Api.Services.Interfaces;

public interface IClinicService
{
    Task<List<ClinicResponseDto>> GetAllAsync();
    Task<ClinicResponseDto> GetByIdAsync(long clinicId);
    Task<ClinicResponseDto> CreateAsync(CreateClinicDto request);
    Task<ClinicResponseDto> UpdateAsync(long clinicId, UpdateClinicDto request);
    Task ChangeStatusAsync(long clinicId, bool isActive);
    Task DeleteAsync(long clinicId);
}

