using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class PercentileReference
{
    public long PercentileId { get; set; }

    public string? Gender { get; set; }

    public decimal? AgeYear { get; set; }

    public string? EyeSide { get; set; }

    public decimal? AxialLengthP5 { get; set; }

    public decimal? AxialLengthP25 { get; set; }

    public decimal? AxialLengthP50 { get; set; }

    public decimal? AxialLengthP75 { get; set; }

    public decimal? AxialLengthP95 { get; set; }

    public string? SourceName { get; set; }

    public DateTime? CreatedAt { get; set; }
}

