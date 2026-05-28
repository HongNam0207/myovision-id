using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;

    public DashboardController(IDashboardService service)
    {
        _service = service;
    }

    [Authorize(Roles = "ADMIN")]
    [HttpGet("admin/overview")]
    public async Task<IActionResult> GetAdminOverview()
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetAdminOverviewAsync()));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpGet("doctor/today-visits")]
    public async Task<IActionResult> GetDoctorTodayVisits()
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetDoctorTodayVisitsAsync()));
    }

    [Authorize(Roles = "ADMIN,NURSE")]
    [HttpGet("nurse/waiting-intake")]
    public async Task<IActionResult> GetNurseWaitingIntake()
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetNurseWaitingIntakeAsync()));
    }

    [Authorize(Roles = "ADMIN,OPTOMETRIST")]
    [HttpGet("optometrist/waiting-measurement")]
    public async Task<IActionResult> GetOptometristWaitingMeasurement()
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetOptometristWaitingMeasurementAsync()));
    }

    [Authorize(Roles = "PARENT")]
    [HttpGet("parent/children-summary")]
    public async Task<IActionResult> GetParentChildrenSummary()
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetParentChildrenSummaryAsync()));
    }
}
