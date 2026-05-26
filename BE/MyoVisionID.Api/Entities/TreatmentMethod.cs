using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class TreatmentMethod
{
    public long TreatmentMethodId { get; set; }

    public string MethodCode { get; set; } = null!;

    public string MethodName { get; set; } = null!;

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<ParentGuide> ParentGuides { get; set; } = new List<ParentGuide>();

    public virtual ICollection<TreatmentPlanItem> TreatmentPlanItems { get; set; } = new List<TreatmentPlanItem>();
}
