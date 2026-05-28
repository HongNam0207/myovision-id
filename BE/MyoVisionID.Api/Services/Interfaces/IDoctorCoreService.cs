using MyoVisionID.Api.DTOs.DoctorCore;

namespace MyoVisionID.Api.Services.Interfaces;

public interface IDoctorCoreService
{
    Task<object> GetVisitFullRecordAsync(long visitId);

    Task<RiskAssessmentDto?> GetRiskAssessmentAsync(long visitId);
    Task<RiskAssessmentDto> CalculateRiskAssessmentAsync(long visitId, CalculateRiskAssessmentDto request);

    Task<DiagnosisDto?> GetDiagnosisAsync(long visitId);
    Task<DiagnosisDto> UpsertDiagnosisAsync(long visitId, UpsertDiagnosisDto request);
    Task<List<DiagnosisDto>> GetDiagnosisHistoryAsync(long patientId);

    Task<List<DoctorNoteDto>> GetDoctorNotesAsync(long visitId);
    Task<DoctorNoteDto> CreateDoctorNoteAsync(long visitId, CreateDoctorNoteDto request);
}

