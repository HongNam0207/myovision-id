using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.ClinicalIntakes;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class ClinicalIntakesController : ControllerBase
{
    private readonly IClinicalIntakeService _service;
    private readonly IVisitService _visitService;

    public ClinicalIntakesController(IClinicalIntakeService service, IVisitService visitService)
    {
        _service = service;
        _visitService = visitService;
    }

    [Authorize(Roles = "ADMIN,NURSE,OPHTHALMOLOGIST,OPTOMETRIST")]
    [HttpGet("visits/{visitId:long}/clinical-intake")]
    public async Task<IActionResult> GetByVisit(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetByVisitIdAsync(visitId)));
    }

    [Authorize(Roles = "ADMIN,NURSE")]
    [HttpPost("visits/{visitId:long}/clinical-intake")]
    public async Task<IActionResult> Create(long visitId, UpsertClinicalIntakeDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CreateAsync(visitId, request)));
    }

    [Authorize(Roles = "ADMIN,NURSE")]
    [HttpPut("clinical-intakes/{intakeId:long}")]
    public async Task<IActionResult> Update(long intakeId, UpsertClinicalIntakeDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.UpdateAsync(intakeId, request)));
    }

    [Authorize(Roles = "ADMIN,NURSE")]
    [HttpPost("visits/{visitId:long}/clinical-intake/complete")]
    public async Task<IActionResult> CompleteIntake(long visitId)
    {
        var intake = await _service.GetByVisitIdAsync(visitId);

        if (intake == null)
            throw new InvalidOperationException("Clinical intake is required before finishing intake.");

        return Ok(ApiResponse<object>.Ok(
            await _visitService.ChangeStatusAsync(visitId, "WAITING_MEASUREMENT", "Clinical intake completed")));
    }
}


