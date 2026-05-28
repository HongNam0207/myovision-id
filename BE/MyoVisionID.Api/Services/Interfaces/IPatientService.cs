using MyoVisionID.Api.DTOs.Patients;

namespace MyoVisionID.Api.Services.Interfaces;

public interface IPatientService
{
    Task<List<PatientResponseDto>> GetAllAsync();
    Task<PatientResponseDto> GetByIdAsync(long patientId);
    Task<PatientResponseDto> CreateAsync(CreatePatientDto request);
    Task<PatientResponseDto> UpdateAsync(long patientId, UpdatePatientDto request);
    Task DeleteAsync(long patientId);

    Task<PatientSummaryDto> GetSummaryAsync(long patientId);
    Task<List<PatientTimelineItemDto>> GetTimelineAsync(long patientId);
}

