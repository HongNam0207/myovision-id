using MyoVisionID.Api.DTOs.Treatments;

namespace MyoVisionID.Api.Services.Interfaces;

public interface ITreatmentService
{
    Task<List<TreatmentPlanDto>> GetPatientPlansAsync(long patientId);
    Task<TreatmentPlanDto> GetPlanAsync(long planId);
    Task<TreatmentPlanDto> CreatePlanAsync(long visitId, UpsertTreatmentPlanDto request);
    Task<TreatmentPlanDto> UpdatePlanAsync(long planId, UpsertTreatmentPlanDto request);
    Task<TreatmentPlanDto> ChangePlanStatusAsync(long planId, string status);

    Task<List<TreatmentPlanItemDto>> GetPlanItemsAsync(long planId);
    Task<TreatmentPlanItemDto> CreatePlanItemAsync(long planId, CreateTreatmentPlanItemDto request);
}
