using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.DoctorCore;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class DoctorCoreController : ControllerBase
{
    private readonly IDoctorCoreService _service;

    public DoctorCoreController(IDoctorCoreService service)
    {
        _service = service;
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpGet("visits/{visitId:long}/full-record")]
    public async Task<IActionResult> GetVisitFullRecord(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(
            await _service.GetVisitFullRecordAsync(visitId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpGet("visits/{visitId:long}/risk-assessment")]
    public async Task<IActionResult> GetRiskAssessment(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(
            await _service.GetRiskAssessmentAsync(visitId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPost("visits/{visitId:long}/risk-assessment/calculate")]
    public async Task<IActionResult> CalculateRiskAssessment(
        long visitId,
        CalculateRiskAssessmentDto request)
    {
        return Ok(ApiResponse<object>.Ok(
            await _service.CalculateRiskAssessmentAsync(visitId, request)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpGet("visits/{visitId:long}/diagnosis")]
    public async Task<IActionResult> GetDiagnosis(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(
            await _service.GetDiagnosisAsync(visitId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPost("visits/{visitId:long}/diagnosis")]
    public async Task<IActionResult> UpsertDiagnosis(
        long visitId,
        UpsertDiagnosisDto request)
    {
        return Ok(ApiResponse<object>.Ok(
            await _service.UpsertDiagnosisAsync(visitId, request)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpGet("patients/{patientId:long}/diagnosis-history")]
    public async Task<IActionResult> GetDiagnosisHistory(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(
            await _service.GetDiagnosisHistoryAsync(patientId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpGet("visits/{visitId:long}/doctor-notes")]
    public async Task<IActionResult> GetDoctorNotes(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(
            await _service.GetDoctorNotesAsync(visitId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPost("visits/{visitId:long}/doctor-notes")]
    public async Task<IActionResult> CreateDoctorNote(
        long visitId,
        CreateDoctorNoteDto request)
    {
        return Ok(ApiResponse<object>.Ok(
            await _service.CreateDoctorNoteAsync(visitId, request)));
    }
}

