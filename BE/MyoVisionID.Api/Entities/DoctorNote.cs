using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class DoctorNote
{
    public long DoctorNoteId { get; set; }

    public long VisitId { get; set; }

    public long PatientId { get; set; }

    public long DoctorId { get; set; }

    public string? NoteType { get; set; }

    public string? NoteContent { get; set; }

    public bool? IsInternal { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User Doctor { get; set; } = null!;

    public virtual Patient Patient { get; set; } = null!;

    public virtual Visit Visit { get; set; } = null!;
}
