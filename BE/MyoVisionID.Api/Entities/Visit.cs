using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class Visit
{
    public long VisitId { get; set; }

    public string VisitCode { get; set; } = null!;

    public long PatientId { get; set; }

    public long? ClinicId { get; set; }

    public DateTime VisitDate { get; set; }

    public string? VisitType { get; set; }

    public string? Status { get; set; }

    public string? ChiefComplaint { get; set; }

    public long? AssignedDoctorId { get; set; }

    public long? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User? AssignedDoctor { get; set; }

    public virtual ICollection<BinocularVision> BinocularVisions { get; set; } = new List<BinocularVision>();

    public virtual Clinic? Clinic { get; set; }

    public virtual ClinicalIntake? ClinicalIntake { get; set; }

    public virtual User? CreatedByNavigation { get; set; }

    public virtual ICollection<DeviceSyncLog> DeviceSyncLogs { get; set; } = new List<DeviceSyncLog>();

    public virtual ICollection<DoctorDiagnosis> DoctorDiagnoses { get; set; } = new List<DoctorDiagnosis>();

    public virtual ICollection<DoctorNote> DoctorNotes { get; set; } = new List<DoctorNote>();

    public virtual ICollection<EyeBiometric> EyeBiometrics { get; set; } = new List<EyeBiometric>();

    public virtual ICollection<EyeRefraction> EyeRefractions { get; set; } = new List<EyeRefraction>();

    public virtual ICollection<FollowUpRecord> FollowUpRecords { get; set; } = new List<FollowUpRecord>();

    public virtual ICollection<MedicalReport> MedicalReports { get; set; } = new List<MedicalReport>();

    public virtual Patient Patient { get; set; } = null!;

    public virtual ICollection<ProgressSnapshot> ProgressSnapshots { get; set; } = new List<ProgressSnapshot>();

    public virtual ICollection<RiskAssessment> RiskAssessments { get; set; } = new List<RiskAssessment>();

    public virtual ICollection<TreatmentPlan> TreatmentPlans { get; set; } = new List<TreatmentPlan>();

    public virtual ICollection<VisitApproval> VisitApprovals { get; set; } = new List<VisitApproval>();

    public virtual ICollection<VisitStatusLog> VisitStatusLogs { get; set; } = new List<VisitStatusLog>();
}
