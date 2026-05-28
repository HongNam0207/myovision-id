using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class BinocularVision
{
    public long BinocularId { get; set; }

    public long VisitId { get; set; }

    public long PatientId { get; set; }

    public decimal? AaOd { get; set; }

    public decimal? AaOs { get; set; }

    public decimal? MemOd { get; set; }

    public decimal? MemOs { get; set; }

    public decimal? FacilityOd { get; set; }

    public decimal? FacilityOs { get; set; }

    public string? CoverTestDistance { get; set; }

    public string? CoverTestNear { get; set; }

    public decimal? AcARatio { get; set; }

    public decimal? NpcCm { get; set; }

    public string? Note { get; set; }

    public long? MeasuredBy { get; set; }

    public DateTime? MeasuredAt { get; set; }

    public virtual User? MeasuredByNavigation { get; set; }

    public virtual Patient Patient { get; set; } = null!;

    public virtual Visit Visit { get; set; } = null!;
}

