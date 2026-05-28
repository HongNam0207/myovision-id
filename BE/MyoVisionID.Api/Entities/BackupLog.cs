using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class BackupLog
{
    public long BackupLogId { get; set; }

    public string? BackupType { get; set; }

    public string? BackupFileUrl { get; set; }

    public string? BackupStatus { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public long? CreatedBy { get; set; }

    public string? Note { get; set; }

    public virtual User? CreatedByNavigation { get; set; }
}

