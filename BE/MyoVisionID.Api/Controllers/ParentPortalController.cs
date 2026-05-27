using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api/parent-portal")]
[Authorize]
public class ParentPortalController : ControllerBase
{
    private readonly IParentPortalService _service;
    private readonly ICurrentUserService _currentUser;

    public ParentPortalController(
        IParentPortalService service,
        ICurrentUserService currentUser)
    {
        _service = service;
        _currentUser = currentUser;
    }

    [Authorize(Roles = "PARENT,ADMIN")]
    [HttpGet("access-check/patients/{patientId:long}")]
    public async Task<IActionResult> AccessCheck(long patientId)
    {
        var result = await _service.ParentCanAccessPatientAsync(
            _currentUser.UserId,
            patientId);

        return Ok(ApiResponse<object>.Ok(new
        {
            PatientId = patientId,
            HasAccess = result
        }));
    }

    [Authorize(Roles = "ADMIN,NURSE,DOCTOR,OPHTHALMOLOGIST")]
    [HttpGet("patients/{patientId:long}/parents")]
    public async Task<IActionResult> GetPatientParents(long patientId)
    {
        return Ok(ApiResponse<object>.Ok(
            await _service.GetPatientParentsAsync(patientId)));
    }
}
