using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class DeviceSyncLog
{
    public long SyncLogId { get; set; }

    public string? DeviceName { get; set; }

    public string? DeviceType { get; set; }

    public long? PatientId { get; set; }

    public long? VisitId { get; set; }

    public string? SyncStatus { get; set; }

    public string? RawData { get; set; }

    public long? SyncedBy { get; set; }

    public DateTime? SyncedAt { get; set; }

    public string? Note { get; set; }

    public virtual Patient? Patient { get; set; }

    public virtual User? SyncedByNavigation { get; set; }

    public virtual Visit? Visit { get; set; }
}

