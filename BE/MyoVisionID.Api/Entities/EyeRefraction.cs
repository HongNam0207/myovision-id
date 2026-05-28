using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class EyeRefraction
{
    public long RefractionId { get; set; }

    public long VisitId { get; set; }

    public long PatientId { get; set; }

    public string EyeSide { get; set; } = null!;

    public string MeasurementType { get; set; } = null!;

    public decimal? Sph { get; set; }

    public decimal? Cyl { get; set; }

    public int? AxisDegree { get; set; }

    public string? Va { get; set; }

    public string? Bcva { get; set; }

    public decimal? Ser { get; set; }

    public string? Note { get; set; }

    public long? MeasuredBy { get; set; }

    public DateTime? MeasuredAt { get; set; }

    public virtual User? MeasuredByNavigation { get; set; }

    public virtual Patient Patient { get; set; } = null!;

    public virtual Visit Visit { get; set; } = null!;
}

