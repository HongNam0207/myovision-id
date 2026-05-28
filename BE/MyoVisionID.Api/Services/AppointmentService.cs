using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Appointments;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class AppointmentService : IAppointmentService
{
    private readonly AppDbContext _context;
    private readonly IClinicScopeService _clinicScope;
    private readonly ICurrentUserService _currentUser;

    public AppointmentService(
        AppDbContext context,
        IClinicScopeService clinicScope,
        ICurrentUserService currentUser)
    {
        _context = context;
        _clinicScope = clinicScope;
        _currentUser = currentUser;
    }

    public async Task<List<AppointmentDto>> GetAppointmentsAsync()
    {
        var query = _context.Appointments.AsQueryable();

        if (!_currentUser.IsInRole("ADMIN"))
        {
            var userId = _currentUser.UserId;
            var clinicIds = await _context.UserClinics
                .Where(x => x.UserId == userId)
                .Select(x => x.ClinicId)
                .ToListAsync();

            query = query.Where(x => x.ClinicId.HasValue && clinicIds.Contains(x.ClinicId.Value));
        }

        return await query
            .OrderByDescending(x => x.AppointmentDatetime)
            .Select(x => MapAppointment(x))
            .ToListAsync();
    }

    public async Task<AppointmentDto> GetAppointmentAsync(long appointmentId)
    {
        var entity = await GetAppointmentEntityAsync(appointmentId);
        return MapAppointment(entity);
    }

    public async Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentDto request)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(x => x.PatientId == request.PatientId);

        if (patient == null)
            throw new KeyNotFoundException("Patient not found.");

        var clinicId = request.ClinicId ?? patient.ClinicId;

        if (clinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(clinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        if (request.ParentId.HasValue)
        {
            var linked = await _context.PatientParents.AnyAsync(x =>
                x.PatientId == request.PatientId &&
                x.ParentId == request.ParentId.Value);

            if (!linked)
                throw new InvalidOperationException("Parent is not linked to this patient.");
        }

        var entity = new Appointment
        {
            PatientId = request.PatientId,
            ParentId = request.ParentId,
            ClinicId = clinicId,
            DoctorId = request.DoctorId,
            AppointmentDatetime = request.AppointmentDatetime,
            AppointmentType = string.IsNullOrWhiteSpace(request.AppointmentType) ? "FOLLOW_UP" : request.AppointmentType,
            Status = "BOOKED",
            Reason = request.Reason,
            Note = request.Note,
            CreatedBy = _currentUser.UserId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Appointments.Add(entity);
        await _context.SaveChangesAsync();

        return MapAppointment(entity);
    }

    public async Task<AppointmentDto> ChangeAppointmentStatusAsync(long appointmentId, string status)
    {
        var entity = await GetAppointmentEntityAsync(appointmentId);

        var validStatuses = new[] { "BOOKED", "CHECKED_IN", "COMPLETED", "CANCELLED", "NO_SHOW" };

        if (!validStatuses.Contains(status))
            throw new InvalidOperationException("Invalid appointment status.");

        entity.Status = status;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapAppointment(entity);
    }

    public async Task<List<NotificationDto>> GetParentNotificationsAsync()
    {
        var query = _context.ParentNotifications.AsQueryable();

        if (_currentUser.IsInRole("PARENT"))
        {
            var parent = await _context.Parents.FirstOrDefaultAsync(x => x.UserId == _currentUser.UserId);

            if (parent == null)
                return new List<NotificationDto>();

            query = query.Where(x => x.ParentId == parent.ParentId);
        }

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => MapNotification(x))
            .ToListAsync();
    }

    public async Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto request)
    {
        var parent = await _context.Parents.FirstOrDefaultAsync(x => x.ParentId == request.ParentId);

        if (parent == null)
            throw new KeyNotFoundException("Parent not found.");

        if (request.PatientId.HasValue)
        {
            var linked = await _context.PatientParents.AnyAsync(x =>
                x.ParentId == request.ParentId &&
                x.PatientId == request.PatientId.Value);

            if (!linked)
                throw new InvalidOperationException("Parent is not linked to this patient.");
        }

        var entity = new ParentNotification
        {
            ParentId = request.ParentId,
            PatientId = request.PatientId,
            Title = request.Title,
            Content = request.Content,
            NotificationType = request.NotificationType,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.ParentNotifications.Add(entity);
        await _context.SaveChangesAsync();

        return MapNotification(entity);
    }

    public async Task<NotificationDto> MarkReadAsync(long notificationId)
    {
        var entity = await _context.ParentNotifications.FirstOrDefaultAsync(x => x.NotificationId == notificationId);

        if (entity == null)
            throw new KeyNotFoundException("Notification not found.");

        if (_currentUser.IsInRole("PARENT"))
        {
            var parent = await _context.Parents.FirstOrDefaultAsync(x => x.UserId == _currentUser.UserId);

            if (parent == null || parent.ParentId != entity.ParentId)
                throw new UnauthorizedAccessException("Notification access denied.");
        }

        entity.IsRead = true;
        await _context.SaveChangesAsync();

        return MapNotification(entity);
    }

    public async Task MarkAllReadAsync()
    {
        if (!_currentUser.IsInRole("PARENT"))
            throw new UnauthorizedAccessException("Only parent can mark all notifications as read.");

        var parent = await _context.Parents.FirstOrDefaultAsync(x => x.UserId == _currentUser.UserId);

        if (parent == null)
            return;

        var items = await _context.ParentNotifications
            .Where(x => x.ParentId == parent.ParentId && x.IsRead == false)
            .ToListAsync();

        foreach (var item in items)
            item.IsRead = true;

        await _context.SaveChangesAsync();
    }

    private async Task<Appointment> GetAppointmentEntityAsync(long appointmentId)
    {
        var entity = await _context.Appointments.FirstOrDefaultAsync(x => x.AppointmentId == appointmentId);

        if (entity == null)
            throw new KeyNotFoundException("Appointment not found.");

        if (entity.ClinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(entity.ClinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        return entity;
    }

    private static AppointmentDto MapAppointment(Appointment x)
    {
        return new AppointmentDto
        {
            AppointmentId = x.AppointmentId,
            PatientId = x.PatientId,
            ParentId = x.ParentId,
            ClinicId = x.ClinicId,
            DoctorId = x.DoctorId,
            AppointmentDatetime = x.AppointmentDatetime,
            AppointmentType = x.AppointmentType,
            Status = x.Status,
            Reason = x.Reason,
            Note = x.Note,
            CreatedBy = x.CreatedBy,
            CreatedAt = x.CreatedAt,
            UpdatedAt = x.UpdatedAt
        };
    }

    private static NotificationDto MapNotification(ParentNotification x)
    {
        return new NotificationDto
        {
            NotificationId = x.NotificationId,
            ParentId = x.ParentId,
            PatientId = x.PatientId,
            Title = x.Title,
            Content = x.Content,
            NotificationType = x.NotificationType,
            IsRead = x.IsRead ?? false,
            CreatedAt = x.CreatedAt
        };
    }
}

