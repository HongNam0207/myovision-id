using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class SystemSetting
{
    public long SettingId { get; set; }

    public string SettingKey { get; set; } = null!;

    public string? SettingValue { get; set; }

    public string? SettingGroup { get; set; }

    public string? Description { get; set; }

    public long? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User? UpdatedByNavigation { get; set; }
}

