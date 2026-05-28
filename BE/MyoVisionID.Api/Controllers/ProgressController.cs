using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.Progress;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class ProgressController : ControllerBase
{
    private readonly IProgressService _service;

    public ProgressController(IProgressService service)
    {
        _service = service;
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST,NURSE")]
    [HttpGet("patients/{patientId:long}/follow-ups")]
    public async Task<IActionResult> GetFollowUps(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetFollowUpsAsync(patientId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST,NURSE")]
    [HttpPost("patients/{patientId:long}/follow-ups")]
    public async Task<IActionResult> CreateFollowUp(long patientId, CreateFollowUpDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CreateFollowUpAsync(patientId, request)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpGet("patients/{patientId:long}/progress-snapshots")]
    public async Task<IActionResult> GetProgressSnapshots(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetProgressSnapshotsAsync(patientId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPost("patients/{patientId:long}/progress-snapshots/generate")]
    public async Task<IActionResult> GenerateSnapshot(
        long patientId,
        [FromQuery] long visitId)
    {
        return Ok(ApiResponse<object>.Ok(
            await _service.GenerateSnapshotAsync(patientId, visitId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpGet("patients/{patientId:long}/progress-chart")]
    public async Task<IActionResult> GetProgressChart(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetProgressChartAsync(patientId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpGet("patients/{patientId:long}/compare-visits")]
    public async Task<IActionResult> CompareVisits(
        long patientId,
        [FromQuery] long fromVisitId,
        [FromQuery] long toVisitId)
    {
        return Ok(ApiResponse<object>.Ok(
            await _service.CompareVisitsAsync(patientId, fromVisitId, toVisitId)));
    }
}
