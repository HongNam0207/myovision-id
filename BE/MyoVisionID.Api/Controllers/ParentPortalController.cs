using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api/parent-portal")]
[Authorize(Roles = "PARENT")]
public class ParentPortalController : ControllerBase
{
    private readonly IParentPortalService _service;

    public ParentPortalController(IParentPortalService service)
    {
        _service = service;
    }

    [HttpGet("my-children")]
    public async Task<IActionResult> GetMyChildren()
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetMyChildrenAsync()));
    }

    [HttpGet("children/{patientId:long}")]
    public async Task<IActionResult> GetChildProfile(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetChildProfileAsync(patientId)));
    }

    [HttpGet("children/{patientId:long}/visits")]
    public async Task<IActionResult> GetChildVisits(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetChildVisitsAsync(patientId)));
    }

    [HttpGet("children/{patientId:long}/progress")]
    public async Task<IActionResult> GetChildProgress(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetChildProgressAsync(patientId)));
    }

    [HttpGet("children/{patientId:long}/progress-chart")]
    public async Task<IActionResult> GetChildProgressChart(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetChildProgressAsync(patientId)));
    }

    [HttpGet("children/{patientId:long}/treatment-plan")]
    public async Task<IActionResult> GetChildTreatmentPlan(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetChildTreatmentPlanAsync(patientId)));
    }

    [HttpGet("children/{patientId:long}/reports")]
    public async Task<IActionResult> GetChildReports(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetChildReportsAsync(patientId)));
    }

    [HttpGet("children/{patientId:long}/notifications")]
    public async Task<IActionResult> GetChildNotifications(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetChildNotificationsAsync(patientId)));
    }

    [HttpGet("children/{patientId:long}/appointments")]
    public async Task<IActionResult> GetChildAppointments(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetChildAppointmentsAsync(patientId)));
    }

    [HttpGet("access-check/patients/{patientId:long}")]
    public async Task<IActionResult> CheckAccess(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CheckAccessAsync(patientId)));
    }
}
