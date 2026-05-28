using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class AppointmentReminder
{
    public long ReminderId { get; set; }

    public long AppointmentId { get; set; }

    public string? ReminderType { get; set; }

    public string? SendTo { get; set; }

    public string? Message { get; set; }

    public DateTime? ScheduledAt { get; set; }

    public DateTime? SentAt { get; set; }

    public string? Status { get; set; }

    public virtual Appointment Appointment { get; set; } = null!;
}

