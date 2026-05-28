using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class TreatmentPlan
{
    public long TreatmentPlanId { get; set; }

    public long VisitId { get; set; }

    public long PatientId { get; set; }

    public long DoctorId { get; set; }

    public string? PlanName { get; set; }

    public string? TreatmentGoal { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Status { get; set; }

    public string? ComplianceTarget { get; set; }

    public int? FollowUpIntervalDays { get; set; }

    public string? DoctorInstruction { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User Doctor { get; set; } = null!;

    public virtual ICollection<FollowUpRecord> FollowUpRecords { get; set; } = new List<FollowUpRecord>();

    public virtual Patient Patient { get; set; } = null!;

    public virtual ICollection<TreatmentPlanItem> TreatmentPlanItems { get; set; } = new List<TreatmentPlanItem>();

    public virtual Visit Visit { get; set; } = null!;
}

