using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class AtropineDetail
{
    public long AtropineDetailId { get; set; }

    public long TreatmentPlanItemId { get; set; }

    public long? MedicineId { get; set; }

    public string? Concentration { get; set; }

    public string? Frequency { get; set; }

    public string? UsageTime { get; set; }

    public string? ToleranceStatus { get; set; }

    public string? SideEffects { get; set; }

    public string? Instruction { get; set; }

    public virtual MedicineCatalog? Medicine { get; set; }

    public virtual TreatmentPlanItem TreatmentPlanItem { get; set; } = null!;
}

