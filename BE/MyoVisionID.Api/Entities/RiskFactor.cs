using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class RiskFactor
{
    public long RiskFactorId { get; set; }

    public long RiskAssessmentId { get; set; }

    public string? FactorCode { get; set; }

    public string? FactorName { get; set; }

    public string? FactorValue { get; set; }

    public decimal? Score { get; set; }

    public string? ImpactLevel { get; set; }

    public string? Note { get; set; }

    public virtual RiskAssessment RiskAssessment { get; set; } = null!;
}

