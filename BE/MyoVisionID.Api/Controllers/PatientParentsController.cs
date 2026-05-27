using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.PatientParents;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api/patients/{patientId:long}/parents")]
[Authorize(Roles = "ADMIN,NURSE")]
public class PatientParentsController : ControllerBase
{
    private readonly IPatientParentService _service;

    public PatientParentsController(IPatientParentService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Assign(long patientId, AssignParentDto request)
    {
        await _service.AssignAsync(
            patientId,
            request.ParentId,
            request.IsPrimaryContact,
            request.CanLogin);

        return Ok(ApiResponse<string>.Ok("Parent assigned to patient."));
    }

    [HttpDelete("{parentId:long}")]
    public async Task<IActionResult> Remove(long patientId, long parentId)
    {
        await _service.RemoveAsync(patientId, parentId);

        return Ok(ApiResponse<string>.Ok("Parent removed from patient."));
    }
}
