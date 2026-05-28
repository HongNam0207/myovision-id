using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class DoctorDiagnosis
{
    public long DiagnosisId { get; set; }

    public long VisitId { get; set; }

    public long PatientId { get; set; }

    public long DoctorId { get; set; }

    public string? DiagnosisCode { get; set; }

    public string? DiagnosisName { get; set; }

    public string? ClinicalConclusion { get; set; }

    public string? MyopiaType { get; set; }

    public string? SeverityLevel { get; set; }

    public string? ProgressionStatus { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User Doctor { get; set; } = null!;

    public virtual Patient Patient { get; set; } = null!;

    public virtual Visit Visit { get; set; } = null!;
}

