using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class VisitApproval
{
    public long ApprovalId { get; set; }

    public long VisitId { get; set; }

    public long ApprovedBy { get; set; }

    public string? ApprovalStatus { get; set; }

    public string? ApprovalNote { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public virtual User ApprovedByNavigation { get; set; } = null!;

    public virtual Visit Visit { get; set; } = null!;
}

