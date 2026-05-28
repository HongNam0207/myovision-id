using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.Clinics;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api/clinics")]
[Authorize(Roles = "ADMIN")]
public class ClinicsController : ControllerBase
{
    private readonly IClinicService _service;

    public ClinicsController(IClinicService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetAllAsync()));
    }

    [HttpGet("{clinicId:long}")]
    public async Task<IActionResult> GetById(long clinicId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetByIdAsync(clinicId)));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateClinicDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CreateAsync(request)));
    }

    [HttpPut("{clinicId:long}")]
    public async Task<IActionResult> Update(long clinicId, UpdateClinicDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.UpdateAsync(clinicId, request)));
    }

    [HttpPatch("{clinicId:long}/status")]
    public async Task<IActionResult> ChangeStatus(long clinicId, [FromQuery] bool isActive)
    {
        await _service.ChangeStatusAsync(clinicId, isActive);
        return Ok(ApiResponse<string>.Ok("Clinic status updated."));
    }

    [HttpDelete("{clinicId:long}")]
    public async Task<IActionResult> Delete(long clinicId)
    {
        await _service.DeleteAsync(clinicId);
        return Ok(ApiResponse<string>.Ok("Clinic disabled."));
    }
}

