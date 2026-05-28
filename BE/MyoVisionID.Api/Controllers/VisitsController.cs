using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.Visits;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api/visits")]
[Authorize]
public class VisitsController : ControllerBase
{
    private readonly IVisitService _service;

    public VisitsController(IVisitService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetAllAsync()));
    }

    [HttpGet("{visitId:long}")]
    public async Task<IActionResult> GetById(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetByIdAsync(visitId)));
    }

    [HttpGet("{visitId:long}/summary")]
    public async Task<IActionResult> GetSummary(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetSummaryAsync(visitId)));
    }

    [HttpGet("{visitId:long}/timeline")]
    public async Task<IActionResult> GetTimeline(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetTimelineAsync(visitId)));
    }

    [Authorize(Roles = "ADMIN,NURSE")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateVisitDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CreateAsync(request)));
    }

    [Authorize(Roles = "ADMIN,NURSE")]
    [HttpPut("{visitId:long}")]
    public async Task<IActionResult> Update(long visitId, UpdateVisitDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.UpdateAsync(visitId, request)));
    }

    [HttpPatch("{visitId:long}/status")]
    public async Task<IActionResult> ChangeStatus(long visitId, ChangeVisitStatusDto request)
    {
        return Ok(ApiResponse<object>.Ok(
            await _service.ChangeStatusAsync(visitId, request.NewStatus, request.Note)));
    }

    [HttpGet("{visitId:long}/status-logs")]
    public async Task<IActionResult> GetStatusLogs(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetStatusLogsAsync(visitId)));
    }

    [Authorize(Roles = "ADMIN,NURSE")]
    [HttpPost("{visitId:long}/start-intake")]
    public async Task<IActionResult> StartIntake(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.ChangeStatusAsync(visitId, "IN_INTAKE", "Start clinical intake")));
    }

    [Authorize(Roles = "ADMIN,NURSE")]
    [HttpPost("{visitId:long}/finish-intake")]
    public async Task<IActionResult> FinishIntake(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.ChangeStatusAsync(visitId, "WAITING_MEASUREMENT", "Finish clinical intake")));
    }

    [Authorize(Roles = "ADMIN,OPTOMETRIST")]
    [HttpPost("{visitId:long}/start-measurement")]
    public async Task<IActionResult> StartMeasurement(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.ChangeStatusAsync(visitId, "IN_MEASUREMENT", "Start eye measurement")));
    }

    [Authorize(Roles = "ADMIN,OPTOMETRIST")]
    [HttpPost("{visitId:long}/finish-measurement")]
    public async Task<IActionResult> FinishMeasurement(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.ChangeStatusAsync(visitId, "WAITING_DOCTOR", "Finish eye measurement")));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPost("{visitId:long}/start-diagnosis")]
    public async Task<IActionResult> StartDiagnosis(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.ChangeStatusAsync(visitId, "IN_DIAGNOSIS", "Start diagnosis")));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPost("{visitId:long}/finish-diagnosis")]
    public async Task<IActionResult> FinishDiagnosis(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.ChangeStatusAsync(visitId, "WAITING_APPROVAL", "Finish diagnosis")));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPost("{visitId:long}/complete")]
    public async Task<IActionResult> Complete(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.ChangeStatusAsync(visitId, "COMPLETED", "Visit completed")));
    }

    [Authorize(Roles = "ADMIN,NURSE,OPTOMETRIST,OPHTHALMOLOGIST")]
    [HttpPost("{visitId:long}/cancel")]
    public async Task<IActionResult> Cancel(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.ChangeStatusAsync(visitId, "CANCELLED", "Visit cancelled")));
    }
}

