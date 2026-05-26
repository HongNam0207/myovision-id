using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class ParentGuide
{
    public long GuideId { get; set; }

    public string GuideCode { get; set; } = null!;

    public string GuideTitle { get; set; } = null!;

    public long? TreatmentMethodId { get; set; }

    public string? Content { get; set; }

    public string? AttachmentUrl { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual TreatmentMethod? TreatmentMethod { get; set; }
}
