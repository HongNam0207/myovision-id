using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.Patients;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api/patients")]
[Authorize]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _service;

    public PatientsController(IPatientService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetAllAsync()));
    }

    [HttpGet("{patientId:long}")]
    public async Task<IActionResult> GetById(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetByIdAsync(patientId)));
    }

    [HttpGet("{patientId:long}/summary")]
    public async Task<IActionResult> GetSummary(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetSummaryAsync(patientId)));
    }

    [HttpGet("{patientId:long}/timeline")]
    public async Task<IActionResult> GetTimeline(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetTimelineAsync(patientId)));
    }

    [Authorize(Roles = "ADMIN,NURSE")]
    [HttpPost]
    public async Task<IActionResult> Create(CreatePatientDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CreateAsync(request)));
    }

    [Authorize(Roles = "ADMIN,NURSE")]
    [HttpPut("{patientId:long}")]
    public async Task<IActionResult> Update(long patientId, UpdatePatientDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.UpdateAsync(patientId, request)));
    }

    [Authorize(Roles = "ADMIN")]
    [HttpDelete("{patientId:long}")]
    public async Task<IActionResult> Delete(long patientId)
    {
        await _service.DeleteAsync(patientId);
        return Ok(ApiResponse<string>.Ok("Patient deleted."));
    }
}
