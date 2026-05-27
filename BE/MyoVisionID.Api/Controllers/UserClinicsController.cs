using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.UserClinics;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api/users/{userId:long}/clinics")]
[Authorize(Roles = "ADMIN")]
public class UserClinicsController : ControllerBase
{
    private readonly IUserClinicService _service;

    public UserClinicsController(IUserClinicService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetByUser(long userId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetByUserAsync(userId)));
    }

    [HttpPost]
    public async Task<IActionResult> Assign(long userId, AssignUserClinicDto request)
    {
        await _service.AssignAsync(userId, request.ClinicId);
        return Ok(ApiResponse<string>.Ok("Clinic assigned to user."));
    }

    [HttpDelete("{clinicId:long}")]
    public async Task<IActionResult> Remove(long userId, long clinicId)
    {
        await _service.RemoveAsync(userId, clinicId);
        return Ok(ApiResponse<string>.Ok("Clinic removed from user."));
    }
}
