using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.Appointments;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class AppointmentController : ControllerBase
{
    private readonly IAppointmentService _service;

    public AppointmentController(IAppointmentService service)
    {
        _service = service;
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST,NURSE")]
    [HttpGet("appointments")]
    public async Task<IActionResult> GetAppointments()
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetAppointmentsAsync()));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST,NURSE")]
    [HttpGet("appointments/{appointmentId:long}")]
    public async Task<IActionResult> GetAppointment(long appointmentId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetAppointmentAsync(appointmentId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST,NURSE")]
    [HttpPost("appointments")]
    public async Task<IActionResult> CreateAppointment(CreateAppointmentDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CreateAppointmentAsync(request)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST,NURSE")]
    [HttpPatch("appointments/{appointmentId:long}/status")]
    public async Task<IActionResult> ChangeAppointmentStatus(long appointmentId, [FromQuery] string status)
    {
        return Ok(ApiResponse<object>.Ok(await _service.ChangeAppointmentStatusAsync(appointmentId, status)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST,NURSE,PARENT")]
    [HttpGet("parent-notifications")]
    public async Task<IActionResult> GetParentNotifications()
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetParentNotificationsAsync()));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST,NURSE")]
    [HttpPost("parent-notifications")]
    public async Task<IActionResult> CreateNotification(CreateNotificationDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CreateNotificationAsync(request)));
    }

    [Authorize(Roles = "ADMIN,PARENT")]
    [HttpPatch("parent-notifications/{notificationId:long}/read")]
    public async Task<IActionResult> MarkRead(long notificationId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.MarkReadAsync(notificationId)));
    }

    [Authorize(Roles = "PARENT")]
    [HttpPatch("parent-notifications/read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
        await _service.MarkAllReadAsync();
        return Ok(ApiResponse<object>.Ok(new { Message = "All notifications marked as read." }));
    }
}
