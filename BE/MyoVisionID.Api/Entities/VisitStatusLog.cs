using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class VisitStatusLog
{
    public long StatusLogId { get; set; }

    public long VisitId { get; set; }

    public string? OldStatus { get; set; }

    public string NewStatus { get; set; } = null!;

    public long? ChangedBy { get; set; }

    public string? Note { get; set; }

    public DateTime? ChangedAt { get; set; }

    public virtual User? ChangedByNavigation { get; set; }

    public virtual Visit Visit { get; set; } = null!;
}
