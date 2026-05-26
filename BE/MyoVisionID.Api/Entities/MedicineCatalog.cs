using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class MedicineCatalog
{
    public long MedicineId { get; set; }

    public string MedicineCode { get; set; } = null!;

    public string MedicineName { get; set; } = null!;

    public string? Concentration { get; set; }

    public string? Unit { get; set; }

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<AtropineDetail> AtropineDetails { get; set; } = new List<AtropineDetail>();
}
