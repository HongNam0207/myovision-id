using MyoVisionID.Api.DTOs.ClinicalIntakes;

namespace MyoVisionID.Api.Services.Interfaces;

public interface IClinicalIntakeService
{
    Task<ClinicalIntakeDto?> GetByVisitIdAsync(long visitId);
    Task<ClinicalIntakeDto> CreateAsync(long visitId, UpsertClinicalIntakeDto request);
    Task<ClinicalIntakeDto> UpdateAsync(long intakeId, UpsertClinicalIntakeDto request);
}

