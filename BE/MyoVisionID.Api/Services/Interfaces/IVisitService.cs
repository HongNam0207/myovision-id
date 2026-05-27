using MyoVisionID.Api.DTOs.Visits;

namespace MyoVisionID.Api.Services.Interfaces;

public interface IVisitService
{
    Task<List<VisitResponseDto>> GetAllAsync();
    Task<VisitResponseDto> GetByIdAsync(long visitId);
    Task<VisitResponseDto> CreateAsync(CreateVisitDto request);
    Task<VisitResponseDto> UpdateAsync(long visitId, UpdateVisitDto request);
    Task<VisitResponseDto> ChangeStatusAsync(long visitId, string newStatus, string? note);
    Task<List<VisitStatusLogDto>> GetStatusLogsAsync(long visitId);
    Task<VisitSummaryDto> GetSummaryAsync(long visitId);
    Task<List<VisitTimelineItemDto>> GetTimelineAsync(long visitId);
}
