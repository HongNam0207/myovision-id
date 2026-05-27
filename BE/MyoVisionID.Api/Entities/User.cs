using System;
using System.Collections.Generic;

namespace MyoVisionID.Api.Entities;

public partial class User
{
    public long UserId { get; set; }

    public string Username { get; set; } = null!;

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string PasswordHash { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string? Gender { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? AvatarUrl { get; set; }

    public string? Status { get; set; }

    public DateTime? LastLoginAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Appointment> AppointmentCreatedByNavigations { get; set; } = new List<Appointment>();

    public virtual ICollection<Appointment> AppointmentDoctors { get; set; } = new List<Appointment>();

    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

    public virtual ICollection<BackupLog> BackupLogs { get; set; } = new List<BackupLog>();

    public virtual ICollection<BinocularVision> BinocularVisions { get; set; } = new List<BinocularVision>();

    public virtual ICollection<ClinicalIntake> ClinicalIntakes { get; set; } = new List<ClinicalIntake>();

    public virtual ICollection<Clinic> Clinics { get; set; } = new List<Clinic>();

    public virtual ICollection<DeviceSyncLog> DeviceSyncLogs { get; set; } = new List<DeviceSyncLog>();

    public virtual ICollection<DoctorDiagnosis> DoctorDiagnoses { get; set; } = new List<DoctorDiagnosis>();

    public virtual ICollection<DoctorNote> DoctorNotes { get; set; } = new List<DoctorNote>();

    public virtual ICollection<EyeBiometric> EyeBiometrics { get; set; } = new List<EyeBiometric>();

    public virtual ICollection<EyeRefraction> EyeRefractions { get; set; } = new List<EyeRefraction>();

    public virtual ICollection<FollowUpRecord> FollowUpRecords { get; set; } = new List<FollowUpRecord>();

    public virtual ICollection<MedicalReport> MedicalReports { get; set; } = new List<MedicalReport>();

    public virtual ICollection<Parent> Parents { get; set; } = new List<Parent>();

    public virtual ICollection<Patient> Patients { get; set; } = new List<Patient>();

    public virtual ICollection<RiskAssessment> RiskAssessments { get; set; } = new List<RiskAssessment>();

    public virtual ICollection<SystemSetting> SystemSettings { get; set; } = new List<SystemSetting>();

    public virtual ICollection<TreatmentPlan> TreatmentPlans { get; set; } = new List<TreatmentPlan>();

    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    public virtual ICollection<UserClinic> UserClinics { get; set; } = new List<UserClinic>();

    public virtual ICollection<VisitApproval> VisitApprovals { get; set; } = new List<VisitApproval>();

    public virtual ICollection<Visit> VisitAssignedDoctors { get; set; } = new List<Visit>();

    public virtual ICollection<Visit> VisitCreatedByNavigations { get; set; } = new List<Visit>();

    public virtual ICollection<VisitStatusLog> VisitStatusLogs { get; set; } = new List<VisitStatusLog>();
}

