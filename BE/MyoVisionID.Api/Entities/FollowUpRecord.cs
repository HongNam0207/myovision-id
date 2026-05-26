using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class FollowUpRecord
{
    public long FollowUpId { get; set; }

    public long PatientId { get; set; }

    public long? VisitId { get; set; }

    public long? TreatmentPlanId { get; set; }

    public DateOnly FollowUpDate { get; set; }

    public string? ComplianceLevel { get; set; }

    public string? SideEffects { get; set; }

    public string? ParentFeedback { get; set; }

    public string? DoctorNote { get; set; }

    public DateOnly? NextFollowUpDate { get; set; }

    public long? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User? CreatedByNavigation { get; set; }

    public virtual Patient Patient { get; set; } = null!;

    public virtual TreatmentPlan? TreatmentPlan { get; set; }

    public virtual Visit? Visit { get; set; }
}
