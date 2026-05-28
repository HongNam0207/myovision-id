using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class Parent
{
    public long ParentId { get; set; }

    public long? UserId { get; set; }

    public string FullName { get; set; } = null!;

    public string? Relationship { get; set; }

    public string Phone { get; set; } = null!;

    public string? Email { get; set; }

    public string? Address { get; set; }

    public string? IdentityNumber { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<ParentNotification> ParentNotifications { get; set; } = new List<ParentNotification>();

    public virtual ICollection<PatientParent> PatientParents { get; set; } = new List<PatientParent>();

    public virtual User? User { get; set; }
}

