using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Visits;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class VisitService : IVisitService
{
    private readonly AppDbContext _context;
    private readonly IClinicScopeService _clinicScope;
    private readonly ICurrentUserService _currentUser;

    private static readonly Dictionary<string, string[]> AllowedTransitions = new()
    {
        ["CREATED"] = new[] { "WAITING_INTAKE", "CANCELLED" },
        ["WAITING_INTAKE"] = new[] { "IN_INTAKE", "CANCELLED" },
        ["IN_INTAKE"] = new[] { "WAITING_MEASUREMENT", "CANCELLED" },
        ["WAITING_MEASUREMENT"] = new[] { "IN_MEASUREMENT", "CANCELLED" },
        ["IN_MEASUREMENT"] = new[] { "WAITING_DOCTOR", "CANCELLED" },
        ["WAITING_DOCTOR"] = new[] { "IN_DIAGNOSIS", "CANCELLED" },
        ["IN_DIAGNOSIS"] = new[] { "WAITING_APPROVAL", "CANCELLED" },
        ["WAITING_APPROVAL"] = new[] { "COMPLETED", "IN_DIAGNOSIS", "CANCELLED" },
        ["COMPLETED"] = Array.Empty<string>(),
        ["CANCELLED"] = Array.Empty<string>()
    };

    public VisitService(AppDbContext context, IClinicScopeService clinicScope, ICurrentUserService currentUser)
    {
        _context = context;
        _clinicScope = clinicScope;
        _currentUser = currentUser;
    }

    public async Task<List<VisitResponseDto>> GetAllAsync()
    {
        var clinicIds = await _clinicScope.GetAccessibleClinicIdsAsync();

        return await _context.Visits
            .Include(x => x.Patient)
            .Include(x => x.Clinic)
            .Include(x => x.AssignedDoctor)
            .Where(x => x.ClinicId != null && clinicIds.Contains(x.ClinicId.Value))
            .OrderByDescending(x => x.VisitDate)
            .Select(x => Map(x))
            .ToListAsync();
    }

    public async Task<VisitResponseDto> GetByIdAsync(long visitId)
    {
        var visit = await GetVisitWithAccessCheck(visitId);
        return Map(visit);
    }

    public async Task<VisitResponseDto> CreateAsync(CreateVisitDto request)
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(x => x.PatientId == request.PatientId);
        if (patient == null)
            throw new KeyNotFoundException("Patient not found.");

        var clinicId = request.ClinicId ?? patient.ClinicId;
        if (clinicId == null)
            throw new InvalidOperationException("Clinic is required.");

        if (!await _clinicScope.CanAccessClinicAsync(clinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        if (await _context.Visits.AnyAsync(x => x.VisitCode == request.VisitCode))
            throw new InvalidOperationException("Visit code already exists.");

        var visit = new Visit
        {
            VisitCode = request.VisitCode,
            PatientId = request.PatientId,
            ClinicId = clinicId,
            VisitDate = DateTime.UtcNow.AddHours(7),
            VisitType = request.VisitType,
            Status = "CREATED",
            ChiefComplaint = request.ChiefComplaint,
            AssignedDoctorId = request.AssignedDoctorId,
            CreatedBy = _currentUser.UserId,
            CreatedAt = DateTime.UtcNow.AddHours(7)
        };

        _context.Visits.Add(visit);
        await _context.SaveChangesAsync();

        await AddStatusLogAsync(visit.VisitId, null, "CREATED", "Visit created");
        await _context.SaveChangesAsync();

        return await GetByIdAsync(visit.VisitId);
    }

    public async Task<VisitResponseDto> UpdateAsync(long visitId, UpdateVisitDto request)
    {
        var visit = await GetVisitWithAccessCheck(visitId);

        visit.VisitType = request.VisitType;
        visit.ChiefComplaint = request.ChiefComplaint;
        visit.AssignedDoctorId = request.AssignedDoctorId;
        visit.UpdatedAt = DateTime.UtcNow.AddHours(7);

        await _context.SaveChangesAsync();

        return await GetByIdAsync(visitId);
    }

    public async Task<VisitResponseDto> ChangeStatusAsync(long visitId, string newStatus, string? note)
    {
        var visit = await GetVisitWithAccessCheck(visitId);

        var oldStatus = visit.Status ?? "CREATED";
        newStatus = newStatus.Trim().ToUpperInvariant();

        if (!AllowedTransitions.ContainsKey(oldStatus))
            throw new InvalidOperationException("Invalid current visit status.");

        if (!AllowedTransitions[oldStatus].Contains(newStatus))
            throw new InvalidOperationException($"Cannot change visit status from {oldStatus} to {newStatus}.");

        visit.Status = newStatus;
        visit.UpdatedAt = DateTime.UtcNow.AddHours(7);

        await AddStatusLogAsync(visit.VisitId, oldStatus, newStatus, note);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(visitId);
    }

    public async Task<List<VisitStatusLogDto>> GetStatusLogsAsync(long visitId)
    {
        _ = await GetVisitWithAccessCheck(visitId);

        return await _context.VisitStatusLogs
            .Include(x => x.ChangedByNavigation)
            .Where(x => x.VisitId == visitId)
            .OrderBy(x => x.ChangedAt)
            .Select(x => new VisitStatusLogDto
            {
                StatusLogId = x.StatusLogId,
                VisitId = x.VisitId,
                OldStatus = x.OldStatus,
                NewStatus = x.NewStatus,
                ChangedBy = x.ChangedBy,
                ChangedByName = x.ChangedByNavigation != null ? x.ChangedByNavigation.FullName : null,
                Note = x.Note,
                ChangedAt = x.ChangedAt
            })
            .ToListAsync();
    }

    public async Task<VisitSummaryDto> GetSummaryAsync(long visitId)
    {
        var visit = await GetVisitWithAccessCheck(visitId);

        var statusLogCount = await _context.VisitStatusLogs
            .CountAsync(x => x.VisitId == visitId);

        return new VisitSummaryDto
        {
            VisitId = visit.VisitId,
            VisitCode = visit.VisitCode,
            Status = visit.Status ?? "CREATED",
            VisitDate = visit.VisitDate,
            PatientName = visit.Patient?.FullName,
            ClinicName = visit.Clinic?.ClinicName,
            AssignedDoctorName = visit.AssignedDoctor?.FullName,
            StatusLogCount = statusLogCount
        };
    }

    public async Task<List<VisitTimelineItemDto>> GetTimelineAsync(long visitId)
    {
        _ = await GetVisitWithAccessCheck(visitId);

        return await _context.VisitStatusLogs
            .Where(x => x.VisitId == visitId)
            .OrderBy(x => x.ChangedAt)
            .Select(x => new VisitTimelineItemDto
            {
                Type = "STATUS",
                Title = (x.OldStatus ?? "NONE") + " -> " + x.NewStatus,
                Note = x.Note,
                EventTime = x.ChangedAt
            })
            .ToListAsync();
    }

    private async Task<Visit> GetVisitWithAccessCheck(long visitId)
    {
        var visit = await _context.Visits
            .Include(x => x.Patient)
            .Include(x => x.Clinic)
            .Include(x => x.AssignedDoctor)
            .FirstOrDefaultAsync(x => x.VisitId == visitId);

        if (visit == null)
            throw new KeyNotFoundException("Visit not found.");

        if (visit.ClinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(visit.ClinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        return visit;
    }

    private async Task AddStatusLogAsync(long visitId, string? oldStatus, string newStatus, string? note)
    {
        _context.VisitStatusLogs.Add(new VisitStatusLog
        {
            VisitId = visitId,
            OldStatus = oldStatus,
            NewStatus = newStatus,
            ChangedBy = _currentUser.UserId,
            Note = note,
            ChangedAt = DateTime.UtcNow.AddHours(7)
        });

        await Task.CompletedTask;
    }

    private static VisitResponseDto Map(Visit visit)
    {
        return new VisitResponseDto
        {
            VisitId = visit.VisitId,
            VisitCode = visit.VisitCode,
            PatientId = visit.PatientId,
            PatientName = visit.Patient?.FullName,
            ClinicId = visit.ClinicId,
            ClinicName = visit.Clinic?.ClinicName,
            VisitDate = visit.VisitDate,
            VisitType = visit.VisitType ?? "INITIAL",
            Status = visit.Status ?? "CREATED",
            ChiefComplaint = visit.ChiefComplaint,
            AssignedDoctorId = visit.AssignedDoctorId,
            AssignedDoctorName = visit.AssignedDoctor?.FullName,
            CreatedBy = visit.CreatedBy,
            CreatedAt = visit.CreatedAt
        };
    }
}

