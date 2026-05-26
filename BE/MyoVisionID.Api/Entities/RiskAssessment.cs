using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class RiskAssessment
{
    public long RiskAssessmentId { get; set; }

    public long VisitId { get; set; }

    public long PatientId { get; set; }

    public long? RiskModelId { get; set; }

    public decimal? TotalScore { get; set; }

    public string? RiskLevel { get; set; }

    public bool? AlCrWarning { get; set; }

    public bool? ProgressionWarning { get; set; }

    public string? Recommendation { get; set; }

    public long? AssessedBy { get; set; }

    public DateTime? AssessedAt { get; set; }

    public virtual User? AssessedByNavigation { get; set; }

    public virtual Patient Patient { get; set; } = null!;

    public virtual ICollection<RiskFactor> RiskFactors { get; set; } = new List<RiskFactor>();

    public virtual RiskModel? RiskModel { get; set; }

    public virtual Visit Visit { get; set; } = null!;
}
