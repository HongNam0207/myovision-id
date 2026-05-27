using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.Visits;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api/visits/{visitId:long}")]
[Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
public class VisitApprovalsController : ControllerBase
{
    private readonly IVisitApprovalService _service;

    public VisitApprovalsController(IVisitApprovalService service)
    {
        _service = service;
    }

    [HttpPost("approve")]
    public async Task<IActionResult> Approve(long visitId, CreateVisitApprovalDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.ApproveAsync(visitId, request.Note)));
    }

    [HttpPost("reject")]
    public async Task<IActionResult> Reject(long visitId, CreateVisitApprovalDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.RejectAsync(visitId, request.Note)));
    }

    [HttpGet("approvals")]
    public async Task<IActionResult> GetApprovals(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetApprovalsAsync(visitId)));
    }
}
