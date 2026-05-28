using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class OrthoKLensCatalog
{
    public long LensCatalogId { get; set; }

    public string BrandName { get; set; } = null!;

    public string? LensModel { get; set; }

    public string? Manufacturer { get; set; }

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<OrthoKDetail> OrthoKDetails { get; set; } = new List<OrthoKDetail>();
}

