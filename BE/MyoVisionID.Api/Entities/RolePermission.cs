using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class RolePermission
{
    public long RolePermissionId { get; set; }

    public long RoleId { get; set; }

    public long PermissionId { get; set; }

    public virtual Permission Permission { get; set; } = null!;

    public virtual Role Role { get; set; } = null!;
}
