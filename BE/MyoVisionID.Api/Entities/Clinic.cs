using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class Clinic
{
    public long ClinicId { get; set; }

    public string ClinicCode { get; set; } = null!;

    public string ClinicName { get; set; } = null!;

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public long? ManagerUserId { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual User? ManagerUser { get; set; }

    public virtual ICollection<Patient> Patients { get; set; } = new List<Patient>();

    public virtual ICollection<Visit> Visits { get; set; } = new List<Visit>();
}
