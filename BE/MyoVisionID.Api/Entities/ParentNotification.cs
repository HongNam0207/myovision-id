using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class ParentNotification
{
    public long NotificationId { get; set; }

    public long ParentId { get; set; }

    public long? PatientId { get; set; }

    public string? Title { get; set; }

    public string? Content { get; set; }

    public string? NotificationType { get; set; }

    public bool? IsRead { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Parent Parent { get; set; } = null!;

    public virtual Patient? Patient { get; set; }
}
