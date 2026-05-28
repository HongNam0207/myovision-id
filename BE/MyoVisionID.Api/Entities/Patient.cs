using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class Patient
{
    public long PatientId { get; set; }

    public string PatientCode { get; set; } = null!;

    public string? HospitalPatientCode { get; set; }

    public string FullName { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public string? Address { get; set; }

    public string? SchoolName { get; set; }

    public string? Grade { get; set; }

    public long? ClinicId { get; set; }

    public string? Status { get; set; }

    public long? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<BinocularVision> BinocularVisions { get; set; } = new List<BinocularVision>();

    public virtual Clinic? Clinic { get; set; }

    public virtual ICollection<ClinicalIntake> ClinicalIntakes { get; set; } = new List<ClinicalIntake>();

    public virtual User? CreatedByNavigation { get; set; }

    public virtual ICollection<DeviceSyncLog> DeviceSyncLogs { get; set; } = new List<DeviceSyncLog>();

    public virtual ICollection<DoctorDiagnosis> DoctorDiagnoses { get; set; } = new List<DoctorDiagnosis>();

    public virtual ICollection<DoctorNote> DoctorNotes { get; set; } = new List<DoctorNote>();

    public virtual ICollection<EyeBiometric> EyeBiometrics { get; set; } = new List<EyeBiometric>();

    public virtual ICollection<EyeRefraction> EyeRefractions { get; set; } = new List<EyeRefraction>();

    public virtual ICollection<FollowUpRecord> FollowUpRecords { get; set; } = new List<FollowUpRecord>();

    public virtual ICollection<MedicalReport> MedicalReports { get; set; } = new List<MedicalReport>();

    public virtual ICollection<ParentNotification> ParentNotifications { get; set; } = new List<ParentNotification>();

    public virtual ICollection<PatientParent> PatientParents { get; set; } = new List<PatientParent>();

    public virtual ICollection<ProgressSnapshot> ProgressSnapshots { get; set; } = new List<ProgressSnapshot>();

    public virtual ICollection<RiskAssessment> RiskAssessments { get; set; } = new List<RiskAssessment>();

    public virtual ICollection<TreatmentPlan> TreatmentPlans { get; set; } = new List<TreatmentPlan>();

    public virtual ICollection<Visit> Visits { get; set; } = new List<Visit>();
}

