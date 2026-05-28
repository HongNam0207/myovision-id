using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.Treatments;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class TreatmentController : ControllerBase
{
    private readonly ITreatmentService _service;

    public TreatmentController(ITreatmentService service)
    {
        _service = service;
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpGet("patients/{patientId:long}/treatment-plans")]
    public async Task<IActionResult> GetPatientPlans(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetPatientPlansAsync(patientId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpGet("treatment-plans/{planId:long}")]
    public async Task<IActionResult> GetPlan(long planId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetPlanAsync(planId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPost("visits/{visitId:long}/treatment-plans")]
    public async Task<IActionResult> CreatePlan(long visitId, UpsertTreatmentPlanDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CreatePlanAsync(visitId, request)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPut("treatment-plans/{planId:long}")]
    public async Task<IActionResult> UpdatePlan(long planId, UpsertTreatmentPlanDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.UpdatePlanAsync(planId, request)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPatch("treatment-plans/{planId:long}/status")]
    public async Task<IActionResult> ChangePlanStatus(long planId, [FromQuery] string status)
    {
        return Ok(ApiResponse<object>.Ok(await _service.ChangePlanStatusAsync(planId, status)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpGet("treatment-plans/{planId:long}/items")]
    public async Task<IActionResult> GetPlanItems(long planId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetPlanItemsAsync(planId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPost("treatment-plans/{planId:long}/items")]
    public async Task<IActionResult> CreatePlanItem(long planId, CreateTreatmentPlanItemDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CreatePlanItemAsync(planId, request)));
    }
}

