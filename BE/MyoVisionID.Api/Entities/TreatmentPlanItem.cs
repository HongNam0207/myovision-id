using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class TreatmentPlanItem
{
    public long TreatmentPlanItemId { get; set; }

    public long TreatmentPlanId { get; set; }

    public long TreatmentMethodId { get; set; }

    public string? ItemName { get; set; }

    public string? DosageOrSpecification { get; set; }

    public string? Frequency { get; set; }

    public string? Instruction { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<AtropineDetail> AtropineDetails { get; set; } = new List<AtropineDetail>();

    public virtual ICollection<OrthoKDetail> OrthoKDetails { get; set; } = new List<OrthoKDetail>();

    public virtual TreatmentMethod TreatmentMethod { get; set; } = null!;

    public virtual TreatmentPlan TreatmentPlan { get; set; } = null!;
}

