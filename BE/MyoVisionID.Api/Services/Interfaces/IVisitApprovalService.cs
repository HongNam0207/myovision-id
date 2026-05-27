using MyoVisionID.Api.DTOs.Visits;

namespace MyoVisionID.Api.Services.Interfaces;

public interface IVisitApprovalService
{
    Task<VisitApprovalDto> ApproveAsync(long visitId, string? note);
    Task<VisitApprovalDto> RejectAsync(long visitId, string? note);
    Task<List<VisitApprovalDto>> GetApprovalsAsync(long visitId);
}
