using MyoVisionID.Api.DTOs.Appointments;

namespace MyoVisionID.Api.Services.Interfaces;

public interface IAppointmentService
{
    Task<List<AppointmentDto>> GetAppointmentsAsync();
    Task<AppointmentDto> GetAppointmentAsync(long appointmentId);
    Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentDto request);
    Task<AppointmentDto> ChangeAppointmentStatusAsync(long appointmentId, string status);

    Task<List<NotificationDto>> GetParentNotificationsAsync();
    Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto request);
    Task<NotificationDto> MarkReadAsync(long notificationId);
    Task MarkAllReadAsync();
}

