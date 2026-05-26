using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class OrthoKDetail
{
    public long OrthoKDetailId { get; set; }

    public long TreatmentPlanItemId { get; set; }

    public string EyeSide { get; set; } = null!;

    public long? LensCatalogId { get; set; }

    public decimal? Bc { get; set; }

    public decimal? Dia { get; set; }

    public decimal? Ozd { get; set; }

    public decimal? Power { get; set; }

    public string? LensDesign { get; set; }

    public DateOnly? DeliveryDate { get; set; }

    public string? WearingSchedule { get; set; }

    public string? CareInstruction { get; set; }

    public string? ComplicationNote { get; set; }

    public virtual OrthoKLensCatalog? LensCatalog { get; set; }

    public virtual TreatmentPlanItem TreatmentPlanItem { get; set; } = null!;
}
