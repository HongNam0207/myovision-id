using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class RiskModel
{
    public long RiskModelId { get; set; }

    public string ModelCode { get; set; } = null!;

    public string ModelName { get; set; } = null!;

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<RiskAssessment> RiskAssessments { get; set; } = new List<RiskAssessment>();
}

