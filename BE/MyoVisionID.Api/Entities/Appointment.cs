using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class Appointment
{
    public long AppointmentId { get; set; }

    public long PatientId { get; set; }

    public long? ParentId { get; set; }

    public long? ClinicId { get; set; }

    public long? DoctorId { get; set; }

    public DateTime AppointmentDatetime { get; set; }

    public string? AppointmentType { get; set; }

    public string? Status { get; set; }

    public string? Reason { get; set; }

    public string? Note { get; set; }

    public long? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<AppointmentReminder> AppointmentReminders { get; set; } = new List<AppointmentReminder>();

    public virtual Clinic? Clinic { get; set; }

    public virtual User? CreatedByNavigation { get; set; }

    public virtual User? Doctor { get; set; }

    public virtual Parent? Parent { get; set; }

    public virtual Patient Patient { get; set; } = null!;
}

