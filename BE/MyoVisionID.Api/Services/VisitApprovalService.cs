using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Visits;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class VisitApprovalService : IVisitApprovalService
{
    private readonly AppDbContext _context;
    private readonly IVisitService _visitService;
    private readonly ICurrentUserService _currentUser;

    public VisitApprovalService(
        AppDbContext context,
        IVisitService visitService,
        ICurrentUserService currentUser)
    {
        _context = context;
        _visitService = visitService;
        _currentUser = currentUser;
    }

    public async Task<VisitApprovalDto> ApproveAsync(long visitId, string? note)
    {
        var visit = await _context.Visits.FirstOrDefaultAsync(x => x.VisitId == visitId);

        if (visit == null)
            throw new KeyNotFoundException("Visit not found.");

        if (visit.Status != "WAITING_APPROVAL")
            throw new InvalidOperationException("Only WAITING_APPROVAL visit can be approved.");

        var approval = new VisitApproval
        {
            VisitId = visitId,
            ApprovedBy = _currentUser.UserId,
            ApprovalStatus = "APPROVED",
            ApprovalNote = note,
            ApprovedAt = DateTime.UtcNow.AddHours(7)
        };

        _context.VisitApprovals.Add(approval);
        await _context.SaveChangesAsync();

        await _visitService.ChangeStatusAsync(visitId, "COMPLETED", "Approved by doctor");

        return await GetByIdAsync(approval.ApprovalId);
    }

    public async Task<VisitApprovalDto> RejectAsync(long visitId, string? note)
    {
        var visit = await _context.Visits.FirstOrDefaultAsync(x => x.VisitId == visitId);

        if (visit == null)
            throw new KeyNotFoundException("Visit not found.");

        if (visit.Status != "WAITING_APPROVAL")
            throw new InvalidOperationException("Only WAITING_APPROVAL visit can be rejected.");

        var approval = new VisitApproval
        {
            VisitId = visitId,
            ApprovedBy = _currentUser.UserId,
            ApprovalStatus = "REJECTED",
            ApprovalNote = note,
            ApprovedAt = DateTime.UtcNow.AddHours(7)
        };

        _context.VisitApprovals.Add(approval);
        await _context.SaveChangesAsync();

        await _visitService.ChangeStatusAsync(visitId, "IN_DIAGNOSIS", "Rejected by doctor");

        return await GetByIdAsync(approval.ApprovalId);
    }

    public async Task<List<VisitApprovalDto>> GetApprovalsAsync(long visitId)
    {
        return await _context.VisitApprovals
            .Include(x => x.ApprovedByNavigation)
            .Where(x => x.VisitId == visitId)
            .OrderByDescending(x => x.ApprovedAt)
            .Select(x => Map(x))
            .ToListAsync();
    }

    private async Task<VisitApprovalDto> GetByIdAsync(long approvalId)
    {
        var approval = await _context.VisitApprovals
            .Include(x => x.ApprovedByNavigation)
            .FirstAsync(x => x.ApprovalId == approvalId);

        return Map(approval);
    }

    private static VisitApprovalDto Map(VisitApproval approval)
    {
        return new VisitApprovalDto
        {
            ApprovalId = approval.ApprovalId,
            VisitId = approval.VisitId,
            ApprovedBy = approval.ApprovedBy,
            ApprovedByName = approval.ApprovedByNavigation?.FullName,
            ApprovalStatus = approval.ApprovalStatus ?? "APPROVED",
            ApprovalNote = approval.ApprovalNote,
            ApprovedAt = approval.ApprovedAt
        };
    }
}

