using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class EyeBiometric
{
    public long BiometricId { get; set; }

    public long VisitId { get; set; }

    public long PatientId { get; set; }

    public string EyeSide { get; set; } = null!;

    public decimal? AxialLengthMm { get; set; }

    public decimal? K1 { get; set; }

    public decimal? K2 { get; set; }

    public decimal? Kmax { get; set; }

    public decimal? PachymetryUm { get; set; }

    public decimal? PupilSizeMm { get; set; }

    public decimal? TbutSeconds { get; set; }

    public decimal? IopMmhg { get; set; }

    public decimal? CornealRadiusMm { get; set; }

    public decimal? AlCrRatio { get; set; }

    public string? DeviceName { get; set; }

    public string? Note { get; set; }

    public long? MeasuredBy { get; set; }

    public DateTime? MeasuredAt { get; set; }

    public virtual User? MeasuredByNavigation { get; set; }

    public virtual Patient Patient { get; set; } = null!;

    public virtual Visit Visit { get; set; } = null!;
}
