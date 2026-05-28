using MyoVisionID.Api.DTOs.Reports;

namespace MyoVisionID.Api.Services.Interfaces;

public interface IReportService
{
    Task<List<MedicalReportDto>> GetVisitReportsAsync(long visitId);
    Task<MedicalReportDto> GetReportAsync(long reportId);
    Task<MedicalReportDto> GenerateReportAsync(long visitId, GenerateReportDto request);
    Task<MedicalReportDto> UpdateVisibilityAsync(long reportId, bool visible);
    Task<MedicalReportDto> UploadPdfAsync(long reportId, UploadReportPdfDto request);
}
