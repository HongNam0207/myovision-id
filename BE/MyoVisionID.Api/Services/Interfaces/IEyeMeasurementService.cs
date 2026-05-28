using MyoVisionID.Api.DTOs.Measurements;

namespace MyoVisionID.Api.Services.Interfaces;

public interface IEyeMeasurementService
{
    Task<List<EyeRefractionDto>> GetRefractionsAsync(long visitId);
    Task<EyeRefractionDto> CreateRefractionAsync(long visitId, CreateEyeRefractionDto request);

    Task<List<EyeBiometricDto>> GetBiometricsAsync(long visitId);
    Task<EyeBiometricDto> CreateBiometricAsync(long visitId, CreateEyeBiometricDto request);

    Task<BinocularVisionDto?> GetBinocularVisionAsync(long visitId);
    Task<BinocularVisionDto> CreateBinocularVisionAsync(long visitId, CreateBinocularVisionDto request);

    Task<object> GetMeasurementHistoryAsync(long patientId);
    Task<object> CompleteMeasurementAsync(long visitId);
}

