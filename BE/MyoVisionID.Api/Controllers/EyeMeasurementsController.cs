using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.Measurements;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class EyeMeasurementsController : ControllerBase
{
    private readonly IEyeMeasurementService _service;

    public EyeMeasurementsController(IEyeMeasurementService service)
    {
        _service = service;
    }

    [Authorize(Roles = "ADMIN,OPTOMETRIST,OPHTHALMOLOGIST")]
    [HttpGet("visits/{visitId:long}/refractions")]
    public async Task<IActionResult> GetRefractions(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetRefractionsAsync(visitId)));
    }

    [Authorize(Roles = "ADMIN,OPTOMETRIST")]
    [HttpPost("visits/{visitId:long}/refractions")]
    public async Task<IActionResult> CreateRefraction(long visitId, CreateEyeRefractionDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CreateRefractionAsync(visitId, request)));
    }

    [Authorize(Roles = "ADMIN,OPTOMETRIST,OPHTHALMOLOGIST")]
    [HttpGet("visits/{visitId:long}/biometrics")]
    public async Task<IActionResult> GetBiometrics(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetBiometricsAsync(visitId)));
    }

    [Authorize(Roles = "ADMIN,OPTOMETRIST")]
    [HttpPost("visits/{visitId:long}/biometrics")]
    public async Task<IActionResult> CreateBiometric(long visitId, CreateEyeBiometricDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CreateBiometricAsync(visitId, request)));
    }

    [Authorize(Roles = "ADMIN,OPTOMETRIST,OPHTHALMOLOGIST")]
    [HttpGet("visits/{visitId:long}/binocular-vision")]
    public async Task<IActionResult> GetBinocularVision(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetBinocularVisionAsync(visitId)));
    }

    [Authorize(Roles = "ADMIN,OPTOMETRIST")]
    [HttpPost("visits/{visitId:long}/binocular-vision")]
    public async Task<IActionResult> CreateBinocularVision(long visitId, CreateBinocularVisionDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CreateBinocularVisionAsync(visitId, request)));
    }

    [Authorize(Roles = "ADMIN,OPTOMETRIST,OPHTHALMOLOGIST")]
    [HttpGet("patients/{patientId:long}/measurement-history")]
    public async Task<IActionResult> GetMeasurementHistory(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetMeasurementHistoryAsync(patientId)));
    }

    [Authorize(Roles = "ADMIN,OPTOMETRIST")]
    [HttpPost("visits/{visitId:long}/measurements/complete")]
    public async Task<IActionResult> CompleteMeasurement(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CompleteMeasurementAsync(visitId)));
    }
}
