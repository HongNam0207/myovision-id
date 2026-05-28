using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class PatientParent
{
    public long PatientParentId { get; set; }

    public long PatientId { get; set; }

    public long ParentId { get; set; }

    public bool? IsPrimaryContact { get; set; }

    public bool? CanLogin { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Parent Parent { get; set; } = null!;

    public virtual Patient Patient { get; set; } = null!;
}

