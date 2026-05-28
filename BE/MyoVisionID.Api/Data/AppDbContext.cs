using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Entities;

namespace MyoVisionID.Api.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<AppointmentReminder> AppointmentReminders { get; set; }

    public virtual DbSet<AtropineDetail> AtropineDetails { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<BackupLog> BackupLogs { get; set; }

    public virtual DbSet<BinocularVision> BinocularVisions { get; set; }

    public virtual DbSet<Clinic> Clinics { get; set; }

    public virtual DbSet<ClinicalIntake> ClinicalIntakes { get; set; }

    public virtual DbSet<DeviceSyncLog> DeviceSyncLogs { get; set; }

    public virtual DbSet<DoctorDiagnosis> DoctorDiagnoses { get; set; }

    public virtual DbSet<DoctorNote> DoctorNotes { get; set; }

    public virtual DbSet<EyeBiometric> EyeBiometrics { get; set; }

    public virtual DbSet<EyeRefraction> EyeRefractions { get; set; }

    public virtual DbSet<FollowUpRecord> FollowUpRecords { get; set; }

    public virtual DbSet<MedicalReport> MedicalReports { get; set; }

    public virtual DbSet<MedicineCatalog> MedicineCatalogs { get; set; }

    public virtual DbSet<OrthoKDetail> OrthoKDetails { get; set; }

    public virtual DbSet<OrthoKLensCatalog> OrthoKLensCatalogs { get; set; }

    public virtual DbSet<Parent> Parents { get; set; }

    public virtual DbSet<ParentGuide> ParentGuides { get; set; }

    public virtual DbSet<ParentNotification> ParentNotifications { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<PatientParent> PatientParents { get; set; }

    public virtual DbSet<PercentileReference> PercentileReferences { get; set; }

    public virtual DbSet<Permission> Permissions { get; set; }

    public virtual DbSet<ProgressSnapshot> ProgressSnapshots { get; set; }

    public virtual DbSet<RiskAssessment> RiskAssessments { get; set; }

    public virtual DbSet<RiskFactor> RiskFactors { get; set; }

    public virtual DbSet<RiskModel> RiskModels { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RolePermission> RolePermissions { get; set; }

    public virtual DbSet<SystemSetting> SystemSettings { get; set; }

    public virtual DbSet<TreatmentMethod> TreatmentMethods { get; set; }

    public virtual DbSet<TreatmentPlan> TreatmentPlans { get; set; }

    public virtual DbSet<TreatmentPlanItem> TreatmentPlanItems { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<Visit> Visits { get; set; }

    public virtual DbSet<VisitApproval> VisitApprovals { get; set; }

    public virtual DbSet<VisitStatusLog> VisitStatusLogs { get; set; }

    

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.RefreshTokenId);

            entity.ToTable("refresh_tokens");

            entity.HasIndex(e => e.Token).IsUnique();

            entity.Property(e => e.RefreshTokenId).HasColumnName("refresh_token_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Token).HasMaxLength(500).HasColumnName("token");
            entity.Property(e => e.ExpiredAt).HasColumnName("expired_at");
            entity.Property(e => e.IsRevoked).HasColumnName("is_revoked");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.RevokedAt).HasColumnName("revoked_at");

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.AppointmentId).HasName("PK__appointm__A50828FC6DA757F7");

            entity.ToTable("appointments");

            entity.Property(e => e.AppointmentId).HasColumnName("appointment_id");
            entity.Property(e => e.AppointmentDatetime).HasColumnName("appointment_datetime");
            entity.Property(e => e.AppointmentType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("FOLLOW_UP")
                .HasColumnName("appointment_type");
            entity.Property(e => e.ClinicId).HasColumnName("clinic_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.DoctorId).HasColumnName("doctor_id");
            entity.Property(e => e.Note)
                .HasMaxLength(1000)
                .HasColumnName("note");
            entity.Property(e => e.ParentId).HasColumnName("parent_id");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.Reason)
                .HasMaxLength(1000)
                .HasColumnName("reason");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("BOOKED")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.Clinic).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.ClinicId)
                .HasConstraintName("fk_appointments_clinic");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.AppointmentCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("fk_appointments_created_by");

            entity.HasOne(d => d.Doctor).WithMany(p => p.AppointmentDoctors)
                .HasForeignKey(d => d.DoctorId)
                .HasConstraintName("fk_appointments_doctor");

            entity.HasOne(d => d.Parent).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("fk_appointments_parent");

            entity.HasOne(d => d.Patient).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_appointments_patient");
        });

        modelBuilder.Entity<AppointmentReminder>(entity =>
        {
            entity.HasKey(e => e.ReminderId).HasName("PK__appointm__E27A3628634F6980");

            entity.ToTable("appointment_reminders");

            entity.Property(e => e.ReminderId).HasColumnName("reminder_id");
            entity.Property(e => e.AppointmentId).HasColumnName("appointment_id");
            entity.Property(e => e.Message)
                .HasMaxLength(1000)
                .HasColumnName("message");
            entity.Property(e => e.ReminderType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("reminder_type");
            entity.Property(e => e.ScheduledAt).HasColumnName("scheduled_at");
            entity.Property(e => e.SendTo)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("send_to");
            entity.Property(e => e.SentAt).HasColumnName("sent_at");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("PENDING")
                .HasColumnName("status");

            entity.HasOne(d => d.Appointment).WithMany(p => p.AppointmentReminders)
                .HasForeignKey(d => d.AppointmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_reminders_appointment");
        });

        modelBuilder.Entity<AtropineDetail>(entity =>
        {
            entity.HasKey(e => e.AtropineDetailId).HasName("PK__atropine__D1861D81D737367B");

            entity.ToTable("atropine_details");

            entity.Property(e => e.AtropineDetailId).HasColumnName("atropine_detail_id");
            entity.Property(e => e.Concentration)
                .HasMaxLength(100)
                .HasColumnName("concentration");
            entity.Property(e => e.Frequency)
                .HasMaxLength(255)
                .HasColumnName("frequency");
            entity.Property(e => e.Instruction).HasColumnName("instruction");
            entity.Property(e => e.MedicineId).HasColumnName("medicine_id");
            entity.Property(e => e.SideEffects)
                .HasMaxLength(1000)
                .HasColumnName("side_effects");
            entity.Property(e => e.ToleranceStatus)
                .HasMaxLength(255)
                .HasColumnName("tolerance_status");
            entity.Property(e => e.TreatmentPlanItemId).HasColumnName("treatment_plan_item_id");
            entity.Property(e => e.UsageTime)
                .HasMaxLength(255)
                .HasColumnName("usage_time");

            entity.HasOne(d => d.Medicine).WithMany(p => p.AtropineDetails)
                .HasForeignKey(d => d.MedicineId)
                .HasConstraintName("fk_atropine_medicine");

            entity.HasOne(d => d.TreatmentPlanItem).WithMany(p => p.AtropineDetails)
                .HasForeignKey(d => d.TreatmentPlanItemId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_atropine_item");
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.AuditLogId).HasName("PK__audit_lo__6031F9F84DCA1BE6");

            entity.ToTable("audit_logs");

            entity.Property(e => e.AuditLogId).HasColumnName("audit_log_id");
            entity.Property(e => e.Action)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("action");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.EntityId).HasColumnName("entity_id");
            entity.Property(e => e.EntityType)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("entity_type");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ip_address");
            entity.Property(e => e.NewValue).HasColumnName("new_value");
            entity.Property(e => e.OldValue).HasColumnName("old_value");
            entity.Property(e => e.UserAgent)
                .HasMaxLength(500)
                .HasColumnName("user_agent");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.AuditLogs)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("fk_audit_logs_user");
        });

        modelBuilder.Entity<BackupLog>(entity =>
        {
            entity.HasKey(e => e.BackupLogId).HasName("PK__backup_l__569770800A95BFBA");

            entity.ToTable("backup_logs");

            entity.Property(e => e.BackupLogId).HasColumnName("backup_log_id");
            entity.Property(e => e.BackupFileUrl)
                .HasMaxLength(500)
                .HasColumnName("backup_file_url");
            entity.Property(e => e.BackupStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("backup_status");
            entity.Property(e => e.BackupType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("backup_type");
            entity.Property(e => e.CompletedAt).HasColumnName("completed_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Note)
                .HasMaxLength(1000)
                .HasColumnName("note");
            entity.Property(e => e.StartedAt).HasColumnName("started_at");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.BackupLogs)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("fk_backup_logs_user");
        });

        modelBuilder.Entity<BinocularVision>(entity =>
        {
            entity.HasKey(e => e.BinocularId).HasName("PK__binocula__794BB7F8132D57AA");

            entity.ToTable("binocular_visions");

            entity.Property(e => e.BinocularId).HasColumnName("binocular_id");
            entity.Property(e => e.AaOd)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("aa_od");
            entity.Property(e => e.AaOs)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("aa_os");
            entity.Property(e => e.AcARatio)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("ac_a_ratio");
            entity.Property(e => e.CoverTestDistance)
                .HasMaxLength(255)
                .HasColumnName("cover_test_distance");
            entity.Property(e => e.CoverTestNear)
                .HasMaxLength(255)
                .HasColumnName("cover_test_near");
            entity.Property(e => e.FacilityOd)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("facility_od");
            entity.Property(e => e.FacilityOs)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("facility_os");
            entity.Property(e => e.MeasuredAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("measured_at");
            entity.Property(e => e.MeasuredBy).HasColumnName("measured_by");
            entity.Property(e => e.MemOd)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("mem_od");
            entity.Property(e => e.MemOs)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("mem_os");
            entity.Property(e => e.Note)
                .HasMaxLength(1000)
                .HasColumnName("note");
            entity.Property(e => e.NpcCm)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("npc_cm");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");

            entity.HasOne(d => d.MeasuredByNavigation).WithMany(p => p.BinocularVisions)
                .HasForeignKey(d => d.MeasuredBy)
                .HasConstraintName("fk_binocular_visions_user");

            entity.HasOne(d => d.Patient).WithMany(p => p.BinocularVisions)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_binocular_visions_patient");

            entity.HasOne(d => d.Visit).WithMany(p => p.BinocularVisions)
                .HasForeignKey(d => d.VisitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_binocular_visions_visit");
        });

        modelBuilder.Entity<Clinic>(entity =>
        {
            entity.HasKey(e => e.ClinicId).HasName("PK__clinics__A0C8D19B22715B33");

            entity.ToTable("clinics");

            entity.HasIndex(e => e.ClinicCode, "UQ__clinics__447BE21651CFB055").IsUnique();

            entity.Property(e => e.ClinicId).HasColumnName("clinic_id");
            entity.Property(e => e.Address)
                .HasMaxLength(500)
                .HasColumnName("address");
            entity.Property(e => e.ClinicCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("clinic_code");
            entity.Property(e => e.ClinicName)
                .HasMaxLength(200)
                .HasColumnName("clinic_name");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.ManagerUserId).HasColumnName("manager_user_id");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");

            entity.HasOne(d => d.ManagerUser).WithMany(p => p.Clinics)
                .HasForeignKey(d => d.ManagerUserId)
                .HasConstraintName("fk_clinics_manager");
        });

        modelBuilder.Entity<ClinicalIntake>(entity =>
        {
            entity.HasKey(e => e.IntakeId).HasName("PK__clinical__A10485F01029EE5C");

            entity.ToTable("clinical_intakes");

            entity.HasIndex(e => e.VisitId, "UQ__clinical__375A75E0DDBFEB0A").IsUnique();

            entity.Property(e => e.IntakeId).HasColumnName("intake_id");
            entity.Property(e => e.AgeMyopiaDetected)
                .HasColumnType("decimal(4, 1)")
                .HasColumnName("age_myopia_detected");
            entity.Property(e => e.AllergyHistory)
                .HasMaxLength(1000)
                .HasColumnName("allergy_history");
            entity.Property(e => e.BloodPressure)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("blood_pressure");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.CurrentGlassesPower)
                .HasMaxLength(255)
                .HasColumnName("current_glasses_power");
            entity.Property(e => e.EnteredBy).HasColumnName("entered_by");
            entity.Property(e => e.EyeDiseaseHistory)
                .HasMaxLength(1000)
                .HasColumnName("eye_disease_history");
            entity.Property(e => e.FamilyHistoryNote)
                .HasMaxLength(1000)
                .HasColumnName("family_history_note");
            entity.Property(e => e.FatherHasMyopia).HasColumnName("father_has_myopia");
            entity.Property(e => e.HeightCm)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("height_cm");
            entity.Property(e => e.MotherHasMyopia).HasColumnName("mother_has_myopia");
            entity.Property(e => e.NearWorkHoursPerDay)
                .HasColumnType("decimal(4, 2)")
                .HasColumnName("near_work_hours_per_day");
            entity.Property(e => e.OutdoorHoursPerDay)
                .HasColumnType("decimal(4, 2)")
                .HasColumnName("outdoor_hours_per_day");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.PreviousTreatment)
                .HasMaxLength(1000)
                .HasColumnName("previous_treatment");
            entity.Property(e => e.ReadingDistanceCm)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("reading_distance_cm");
            entity.Property(e => e.ReasonForVisit)
                .HasMaxLength(1000)
                .HasColumnName("reason_for_visit");
            entity.Property(e => e.ScreenTimeHoursPerDay)
                .HasColumnType("decimal(4, 2)")
                .HasColumnName("screen_time_hours_per_day");
            entity.Property(e => e.SiblingHasMyopia).HasColumnName("sibling_has_myopia");
            entity.Property(e => e.SystemicDiseaseHistory)
                .HasMaxLength(1000)
                .HasColumnName("systemic_disease_history");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");
            entity.Property(e => e.WeightKg)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("weight_kg");

            entity.HasOne(d => d.EnteredByNavigation).WithMany(p => p.ClinicalIntakes)
                .HasForeignKey(d => d.EnteredBy)
                .HasConstraintName("fk_clinical_intakes_entered_by");

            entity.HasOne(d => d.Patient).WithMany(p => p.ClinicalIntakes)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_clinical_intakes_patient");

            entity.HasOne(d => d.Visit).WithOne(p => p.ClinicalIntake)
                .HasForeignKey<ClinicalIntake>(d => d.VisitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_clinical_intakes_visit");
        });

        modelBuilder.Entity<DeviceSyncLog>(entity =>
        {
            entity.HasKey(e => e.SyncLogId).HasName("PK__device_s__3BE9C4BB156E8DB4");

            entity.ToTable("device_sync_logs");

            entity.Property(e => e.SyncLogId).HasColumnName("sync_log_id");
            entity.Property(e => e.DeviceName)
                .HasMaxLength(255)
                .HasColumnName("device_name");
            entity.Property(e => e.DeviceType)
                .HasMaxLength(100)
                .HasColumnName("device_type");
            entity.Property(e => e.Note)
                .HasMaxLength(1000)
                .HasColumnName("note");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.RawData).HasColumnName("raw_data");
            entity.Property(e => e.SyncStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("sync_status");
            entity.Property(e => e.SyncedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("synced_at");
            entity.Property(e => e.SyncedBy).HasColumnName("synced_by");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");

            entity.HasOne(d => d.Patient).WithMany(p => p.DeviceSyncLogs)
                .HasForeignKey(d => d.PatientId)
                .HasConstraintName("fk_device_sync_patient");

            entity.HasOne(d => d.SyncedByNavigation).WithMany(p => p.DeviceSyncLogs)
                .HasForeignKey(d => d.SyncedBy)
                .HasConstraintName("fk_device_sync_user");

            entity.HasOne(d => d.Visit).WithMany(p => p.DeviceSyncLogs)
                .HasForeignKey(d => d.VisitId)
                .HasConstraintName("fk_device_sync_visit");
        });

        modelBuilder.Entity<DoctorDiagnosis>(entity =>
        {
            entity.HasKey(e => e.DiagnosisId).HasName("PK__doctor_d__D49E32B4F9CFA8DF");

            entity.ToTable("doctor_diagnoses");

            entity.Property(e => e.DiagnosisId).HasColumnName("diagnosis_id");
            entity.Property(e => e.ClinicalConclusion)
                .HasMaxLength(2000)
                .HasColumnName("clinical_conclusion");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.DiagnosisCode)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("diagnosis_code");
            entity.Property(e => e.DiagnosisName)
                .HasMaxLength(500)
                .HasColumnName("diagnosis_name");
            entity.Property(e => e.DoctorId).HasColumnName("doctor_id");
            entity.Property(e => e.MyopiaType)
                .HasMaxLength(255)
                .HasColumnName("myopia_type");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.ProgressionStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("progression_status");
            entity.Property(e => e.SeverityLevel)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("severity_level");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");

            entity.HasOne(d => d.Doctor).WithMany(p => p.DoctorDiagnoses)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_doctor_diagnoses_doctor");

            entity.HasOne(d => d.Patient).WithMany(p => p.DoctorDiagnoses)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_doctor_diagnoses_patient");

            entity.HasOne(d => d.Visit).WithMany(p => p.DoctorDiagnoses)
                .HasForeignKey(d => d.VisitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_doctor_diagnoses_visit");
        });

        modelBuilder.Entity<DoctorNote>(entity =>
        {
            entity.HasKey(e => e.DoctorNoteId).HasName("PK__doctor_n__3722698BD23A469C");

            entity.ToTable("doctor_notes");

            entity.Property(e => e.DoctorNoteId).HasColumnName("doctor_note_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.DoctorId).HasColumnName("doctor_id");
            entity.Property(e => e.IsInternal)
                .HasDefaultValue(true)
                .HasColumnName("is_internal");
            entity.Property(e => e.NoteContent).HasColumnName("note_content");
            entity.Property(e => e.NoteType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("CLINICAL")
                .HasColumnName("note_type");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");

            entity.HasOne(d => d.Doctor).WithMany(p => p.DoctorNotes)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_doctor_notes_doctor");

            entity.HasOne(d => d.Patient).WithMany(p => p.DoctorNotes)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_doctor_notes_patient");

            entity.HasOne(d => d.Visit).WithMany(p => p.DoctorNotes)
                .HasForeignKey(d => d.VisitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_doctor_notes_visit");
        });

        modelBuilder.Entity<EyeBiometric>(entity =>
        {
            entity.HasKey(e => e.BiometricId).HasName("PK__eye_biom__7EB1F4D8551F929C");

            entity.ToTable("eye_biometrics");

            entity.Property(e => e.BiometricId).HasColumnName("biometric_id");
            entity.Property(e => e.AlCrRatio)
                .HasColumnType("decimal(6, 3)")
                .HasColumnName("al_cr_ratio");
            entity.Property(e => e.AxialLengthMm)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("axial_length_mm");
            entity.Property(e => e.CornealRadiusMm)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("corneal_radius_mm");
            entity.Property(e => e.DeviceName)
                .HasMaxLength(255)
                .HasColumnName("device_name");
            entity.Property(e => e.EyeSide)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("eye_side");
            entity.Property(e => e.IopMmhg)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("iop_mmhg");
            entity.Property(e => e.K1)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("k1");
            entity.Property(e => e.K2)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("k2");
            entity.Property(e => e.Kmax)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("kmax");
            entity.Property(e => e.MeasuredAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("measured_at");
            entity.Property(e => e.MeasuredBy).HasColumnName("measured_by");
            entity.Property(e => e.Note)
                .HasMaxLength(1000)
                .HasColumnName("note");
            entity.Property(e => e.PachymetryUm)
                .HasColumnType("decimal(6, 2)")
                .HasColumnName("pachymetry_um");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.PupilSizeMm)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("pupil_size_mm");
            entity.Property(e => e.TbutSeconds)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("tbut_seconds");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");

            entity.HasOne(d => d.MeasuredByNavigation).WithMany(p => p.EyeBiometrics)
                .HasForeignKey(d => d.MeasuredBy)
                .HasConstraintName("fk_eye_biometrics_user");

            entity.HasOne(d => d.Patient).WithMany(p => p.EyeBiometrics)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_eye_biometrics_patient");

            entity.HasOne(d => d.Visit).WithMany(p => p.EyeBiometrics)
                .HasForeignKey(d => d.VisitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_eye_biometrics_visit");
        });

        modelBuilder.Entity<EyeRefraction>(entity =>
        {
            entity.HasKey(e => e.RefractionId).HasName("PK__eye_refr__B62A0626A03A11A4");

            entity.ToTable("eye_refractions");

            entity.Property(e => e.RefractionId).HasColumnName("refraction_id");
            entity.Property(e => e.AxisDegree).HasColumnName("axis_degree");
            entity.Property(e => e.Bcva)
                .HasMaxLength(50)
                .HasColumnName("bcva");
            entity.Property(e => e.Cyl)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("cyl");
            entity.Property(e => e.EyeSide)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("eye_side");
            entity.Property(e => e.MeasuredAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("measured_at");
            entity.Property(e => e.MeasuredBy).HasColumnName("measured_by");
            entity.Property(e => e.MeasurementType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("measurement_type");
            entity.Property(e => e.Note)
                .HasMaxLength(1000)
                .HasColumnName("note");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.Ser)
                .HasComputedColumnSql("(isnull([sph],(0))+isnull([cyl],(0))/(2.0))", true)
                .HasColumnType("numeric(11, 6)")
                .HasColumnName("ser");
            entity.Property(e => e.Sph)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("sph");
            entity.Property(e => e.Va)
                .HasMaxLength(50)
                .HasColumnName("va");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");

            entity.HasOne(d => d.MeasuredByNavigation).WithMany(p => p.EyeRefractions)
                .HasForeignKey(d => d.MeasuredBy)
                .HasConstraintName("fk_eye_refractions_user");

            entity.HasOne(d => d.Patient).WithMany(p => p.EyeRefractions)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_eye_refractions_patient");

            entity.HasOne(d => d.Visit).WithMany(p => p.EyeRefractions)
                .HasForeignKey(d => d.VisitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_eye_refractions_visit");
        });

        modelBuilder.Entity<FollowUpRecord>(entity =>
        {
            entity.HasKey(e => e.FollowUpId).HasName("PK__follow_u__53C081445DE08D94");

            entity.ToTable("follow_up_records");

            entity.Property(e => e.FollowUpId).HasColumnName("follow_up_id");
            entity.Property(e => e.ComplianceLevel)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("compliance_level");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.DoctorNote)
                .HasMaxLength(2000)
                .HasColumnName("doctor_note");
            entity.Property(e => e.FollowUpDate).HasColumnName("follow_up_date");
            entity.Property(e => e.NextFollowUpDate).HasColumnName("next_follow_up_date");
            entity.Property(e => e.ParentFeedback)
                .HasMaxLength(1000)
                .HasColumnName("parent_feedback");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.SideEffects)
                .HasMaxLength(1000)
                .HasColumnName("side_effects");
            entity.Property(e => e.TreatmentPlanId).HasColumnName("treatment_plan_id");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.FollowUpRecords)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("fk_follow_up_user");

            entity.HasOne(d => d.Patient).WithMany(p => p.FollowUpRecords)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_follow_up_patient");

            entity.HasOne(d => d.TreatmentPlan).WithMany(p => p.FollowUpRecords)
                .HasForeignKey(d => d.TreatmentPlanId)
                .HasConstraintName("fk_follow_up_plan");

            entity.HasOne(d => d.Visit).WithMany(p => p.FollowUpRecords)
                .HasForeignKey(d => d.VisitId)
                .HasConstraintName("fk_follow_up_visit");
        });

        modelBuilder.Entity<MedicalReport>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__medical___779B7C58E766C284");

            entity.ToTable("medical_reports");

            entity.Property(e => e.ReportId).HasColumnName("report_id");
            entity.Property(e => e.GeneratedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("generated_at");
            entity.Property(e => e.GeneratedBy).HasColumnName("generated_by");
            entity.Property(e => e.IsVisibleToParent)
                .HasDefaultValue(true)
                .HasColumnName("is_visible_to_parent");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.PdfUrl)
                .HasMaxLength(500)
                .HasColumnName("pdf_url");
            entity.Property(e => e.ReportContent).HasColumnName("report_content");
            entity.Property(e => e.ReportTitle)
                .HasMaxLength(255)
                .HasColumnName("report_title");
            entity.Property(e => e.ReportType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("VISIT_SUMMARY")
                .HasColumnName("report_type");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");

            entity.HasOne(d => d.GeneratedByNavigation).WithMany(p => p.MedicalReports)
                .HasForeignKey(d => d.GeneratedBy)
                .HasConstraintName("fk_reports_user");

            entity.HasOne(d => d.Patient).WithMany(p => p.MedicalReports)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_reports_patient");

            entity.HasOne(d => d.Visit).WithMany(p => p.MedicalReports)
                .HasForeignKey(d => d.VisitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_reports_visit");
        });

        modelBuilder.Entity<MedicineCatalog>(entity =>
        {
            entity.HasKey(e => e.MedicineId).HasName("PK__medicine__E7148EBBF023FEEF");

            entity.ToTable("medicine_catalog");

            entity.HasIndex(e => e.MedicineCode, "UQ__medicine__7CAD9BFB1F445C7E").IsUnique();

            entity.Property(e => e.MedicineId).HasColumnName("medicine_id");
            entity.Property(e => e.Concentration)
                .HasMaxLength(100)
                .HasColumnName("concentration");
            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.MedicineCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("medicine_code");
            entity.Property(e => e.MedicineName)
                .HasMaxLength(255)
                .HasColumnName("medicine_name");
            entity.Property(e => e.Unit)
                .HasMaxLength(50)
                .HasColumnName("unit");
        });

        modelBuilder.Entity<OrthoKDetail>(entity =>
        {
            entity.HasKey(e => e.OrthoKDetailId).HasName("PK__ortho_k___EC0BD6C2EF370476");

            entity.ToTable("ortho_k_details");

            entity.Property(e => e.OrthoKDetailId).HasColumnName("ortho_k_detail_id");
            entity.Property(e => e.Bc)
                .HasColumnType("decimal(6, 3)")
                .HasColumnName("bc");
            entity.Property(e => e.CareInstruction).HasColumnName("care_instruction");
            entity.Property(e => e.ComplicationNote)
                .HasMaxLength(1000)
                .HasColumnName("complication_note");
            entity.Property(e => e.DeliveryDate).HasColumnName("delivery_date");
            entity.Property(e => e.Dia)
                .HasColumnType("decimal(6, 3)")
                .HasColumnName("dia");
            entity.Property(e => e.EyeSide)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("eye_side");
            entity.Property(e => e.LensCatalogId).HasColumnName("lens_catalog_id");
            entity.Property(e => e.LensDesign)
                .HasMaxLength(255)
                .HasColumnName("lens_design");
            entity.Property(e => e.Ozd)
                .HasColumnType("decimal(6, 3)")
                .HasColumnName("ozd");
            entity.Property(e => e.Power)
                .HasColumnType("decimal(6, 2)")
                .HasColumnName("power");
            entity.Property(e => e.TreatmentPlanItemId).HasColumnName("treatment_plan_item_id");
            entity.Property(e => e.WearingSchedule)
                .HasMaxLength(500)
                .HasColumnName("wearing_schedule");

            entity.HasOne(d => d.LensCatalog).WithMany(p => p.OrthoKDetails)
                .HasForeignKey(d => d.LensCatalogId)
                .HasConstraintName("fk_ortho_k_catalog");

            entity.HasOne(d => d.TreatmentPlanItem).WithMany(p => p.OrthoKDetails)
                .HasForeignKey(d => d.TreatmentPlanItemId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ortho_k_item");
        });

        modelBuilder.Entity<OrthoKLensCatalog>(entity =>
        {
            entity.HasKey(e => e.LensCatalogId).HasName("PK__ortho_k___82AF676935CB79CB");

            entity.ToTable("ortho_k_lens_catalog");

            entity.Property(e => e.LensCatalogId).HasColumnName("lens_catalog_id");
            entity.Property(e => e.BrandName)
                .HasMaxLength(255)
                .HasColumnName("brand_name");
            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.LensModel)
                .HasMaxLength(255)
                .HasColumnName("lens_model");
            entity.Property(e => e.Manufacturer)
                .HasMaxLength(255)
                .HasColumnName("manufacturer");
        });

        modelBuilder.Entity<Parent>(entity =>
        {
            entity.HasKey(e => e.ParentId).HasName("PK__parents__F2A60819B812046B");

            entity.ToTable("parents");

            entity.Property(e => e.ParentId).HasColumnName("parent_id");
            entity.Property(e => e.Address)
                .HasMaxLength(500)
                .HasColumnName("address");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(150)
                .HasColumnName("full_name");
            entity.Property(e => e.IdentityNumber)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("identity_number");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.Relationship)
                .HasMaxLength(50)
                .HasColumnName("relationship");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Parents)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("fk_parents_user");
        });

        modelBuilder.Entity<ParentGuide>(entity =>
        {
            entity.HasKey(e => e.GuideId).HasName("PK__parent_g__04A82241522B8E0C");

            entity.ToTable("parent_guides");

            entity.HasIndex(e => e.GuideCode, "UQ__parent_g__29A67E3CA0450837").IsUnique();

            entity.Property(e => e.GuideId).HasColumnName("guide_id");
            entity.Property(e => e.AttachmentUrl)
                .HasMaxLength(500)
                .HasColumnName("attachment_url");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.GuideCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("guide_code");
            entity.Property(e => e.GuideTitle)
                .HasMaxLength(255)
                .HasColumnName("guide_title");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.TreatmentMethodId).HasColumnName("treatment_method_id");

            entity.HasOne(d => d.TreatmentMethod).WithMany(p => p.ParentGuides)
                .HasForeignKey(d => d.TreatmentMethodId)
                .HasConstraintName("fk_parent_guides_method");
        });

        modelBuilder.Entity<ParentNotification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__parent_n__E059842FD214B958");

            entity.ToTable("parent_notifications");

            entity.Property(e => e.NotificationId).HasColumnName("notification_id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.IsRead)
                .HasDefaultValue(false)
                .HasColumnName("is_read");
            entity.Property(e => e.NotificationType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("notification_type");
            entity.Property(e => e.ParentId).HasColumnName("parent_id");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .HasColumnName("title");

            entity.HasOne(d => d.Parent).WithMany(p => p.ParentNotifications)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_notifications_parent");

            entity.HasOne(d => d.Patient).WithMany(p => p.ParentNotifications)
                .HasForeignKey(d => d.PatientId)
                .HasConstraintName("fk_notifications_patient");
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.PatientId).HasName("PK__patients__4D5CE476BFBF7F71");

            entity.ToTable("patients");

            entity.HasIndex(e => e.PatientCode, "UQ__patients__58D46F1F7D944AE1").IsUnique();

            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.Address)
                .HasMaxLength(500)
                .HasColumnName("address");
            entity.Property(e => e.ClinicId).HasColumnName("clinic_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.FullName)
                .HasMaxLength(150)
                .HasColumnName("full_name");
            entity.Property(e => e.Gender)
                .HasMaxLength(20)
                .HasColumnName("gender");
            entity.Property(e => e.Grade)
                .HasMaxLength(50)
                .HasColumnName("grade");
            entity.Property(e => e.HospitalPatientCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("hospital_patient_code");
            entity.Property(e => e.PatientCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("patient_code");
            entity.Property(e => e.SchoolName)
                .HasMaxLength(255)
                .HasColumnName("school_name");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("ACTIVE")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.Clinic).WithMany(p => p.Patients)
                .HasForeignKey(d => d.ClinicId)
                .HasConstraintName("fk_patients_clinic");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Patients)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("fk_patients_created_by");
        });

        modelBuilder.Entity<PatientParent>(entity =>
        {
            entity.HasKey(e => e.PatientParentId).HasName("PK__patient___23C5768FF062F3E7");

            entity.ToTable("patient_parents");

            entity.HasIndex(e => new { e.PatientId, e.ParentId }, "uq_patient_parent").IsUnique();

            entity.Property(e => e.PatientParentId).HasColumnName("patient_parent_id");
            entity.Property(e => e.CanLogin)
                .HasDefaultValue(true)
                .HasColumnName("can_login");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.IsPrimaryContact)
                .HasDefaultValue(false)
                .HasColumnName("is_primary_contact");
            entity.Property(e => e.ParentId).HasColumnName("parent_id");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");

            entity.HasOne(d => d.Parent).WithMany(p => p.PatientParents)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_patient_parents_parent");

            entity.HasOne(d => d.Patient).WithMany(p => p.PatientParents)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_patient_parents_patient");
        });

        modelBuilder.Entity<PercentileReference>(entity =>
        {
            entity.HasKey(e => e.PercentileId).HasName("PK__percenti__B48281627A07228A");

            entity.ToTable("percentile_references");

            entity.Property(e => e.PercentileId).HasColumnName("percentile_id");
            entity.Property(e => e.AgeYear)
                .HasColumnType("decimal(4, 1)")
                .HasColumnName("age_year");
            entity.Property(e => e.AxialLengthP25)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("axial_length_p25");
            entity.Property(e => e.AxialLengthP5)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("axial_length_p5");
            entity.Property(e => e.AxialLengthP50)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("axial_length_p50");
            entity.Property(e => e.AxialLengthP75)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("axial_length_p75");
            entity.Property(e => e.AxialLengthP95)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("axial_length_p95");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.EyeSide)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("eye_side");
            entity.Property(e => e.Gender)
                .HasMaxLength(20)
                .HasColumnName("gender");
            entity.Property(e => e.SourceName)
                .HasMaxLength(255)
                .HasColumnName("source_name");
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(e => e.PermissionId).HasName("PK__permissi__E5331AFA3C92445C");

            entity.ToTable("permissions");

            entity.HasIndex(e => e.PermissionCode, "UQ__permissi__A98A808EFE76CC33").IsUnique();

            entity.Property(e => e.PermissionId).HasColumnName("permission_id");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .HasColumnName("description");
            entity.Property(e => e.ModuleName)
                .HasMaxLength(100)
                .HasColumnName("module_name");
            entity.Property(e => e.PermissionCode)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("permission_code");
            entity.Property(e => e.PermissionName)
                .HasMaxLength(150)
                .HasColumnName("permission_name");
        });

        modelBuilder.Entity<ProgressSnapshot>(entity =>
        {
            entity.HasKey(e => e.ProgressSnapshotId).HasName("PK__progress__3D46753B2623C9D6");

            entity.ToTable("progress_snapshots");

            entity.Property(e => e.ProgressSnapshotId).HasColumnName("progress_snapshot_id");
            entity.Property(e => e.AlGrowthOd)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("al_growth_od");
            entity.Property(e => e.AlGrowthOs)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("al_growth_os");
            entity.Property(e => e.AxialLengthOd)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("axial_length_od");
            entity.Property(e => e.AxialLengthOs)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("axial_length_os");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.IopOd)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("iop_od");
            entity.Property(e => e.IopOs)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("iop_os");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.ProgressionNote)
                .HasMaxLength(1000)
                .HasColumnName("progression_note");
            entity.Property(e => e.SerChangeOd)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("ser_change_od");
            entity.Property(e => e.SerChangeOs)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("ser_change_os");
            entity.Property(e => e.SerOd)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("ser_od");
            entity.Property(e => e.SerOs)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("ser_os");
            entity.Property(e => e.SnapshotDate).HasColumnName("snapshot_date");
            entity.Property(e => e.VaOd)
                .HasMaxLength(50)
                .HasColumnName("va_od");
            entity.Property(e => e.VaOs)
                .HasMaxLength(50)
                .HasColumnName("va_os");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");

            entity.HasOne(d => d.Patient).WithMany(p => p.ProgressSnapshots)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_progress_patient");

            entity.HasOne(d => d.Visit).WithMany(p => p.ProgressSnapshots)
                .HasForeignKey(d => d.VisitId)
                .HasConstraintName("fk_progress_visit");
        });

        modelBuilder.Entity<RiskAssessment>(entity =>
        {
            entity.HasKey(e => e.RiskAssessmentId).HasName("PK__risk_ass__B502AD3641E1D8E8");

            entity.ToTable("risk_assessments");

            entity.Property(e => e.RiskAssessmentId).HasColumnName("risk_assessment_id");
            entity.Property(e => e.AlCrWarning)
                .HasDefaultValue(false)
                .HasColumnName("al_cr_warning");
            entity.Property(e => e.AssessedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("assessed_at");
            entity.Property(e => e.AssessedBy).HasColumnName("assessed_by");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.ProgressionWarning)
                .HasDefaultValue(false)
                .HasColumnName("progression_warning");
            entity.Property(e => e.Recommendation)
                .HasMaxLength(2000)
                .HasColumnName("recommendation");
            entity.Property(e => e.RiskLevel)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("risk_level");
            entity.Property(e => e.RiskModelId).HasColumnName("risk_model_id");
            entity.Property(e => e.TotalScore)
                .HasColumnType("decimal(6, 2)")
                .HasColumnName("total_score");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");

            entity.HasOne(d => d.AssessedByNavigation).WithMany(p => p.RiskAssessments)
                .HasForeignKey(d => d.AssessedBy)
                .HasConstraintName("fk_risk_assessments_user");

            entity.HasOne(d => d.Patient).WithMany(p => p.RiskAssessments)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_risk_assessments_patient");

            entity.HasOne(d => d.RiskModel).WithMany(p => p.RiskAssessments)
                .HasForeignKey(d => d.RiskModelId)
                .HasConstraintName("fk_risk_assessments_model");

            entity.HasOne(d => d.Visit).WithMany(p => p.RiskAssessments)
                .HasForeignKey(d => d.VisitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_risk_assessments_visit");
        });

        modelBuilder.Entity<RiskFactor>(entity =>
        {
            entity.HasKey(e => e.RiskFactorId).HasName("PK__risk_fac__F6BFD2266DACC872");

            entity.ToTable("risk_factors");

            entity.Property(e => e.RiskFactorId).HasColumnName("risk_factor_id");
            entity.Property(e => e.FactorCode)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("factor_code");
            entity.Property(e => e.FactorName)
                .HasMaxLength(255)
                .HasColumnName("factor_name");
            entity.Property(e => e.FactorValue)
                .HasMaxLength(255)
                .HasColumnName("factor_value");
            entity.Property(e => e.ImpactLevel)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("impact_level");
            entity.Property(e => e.Note)
                .HasMaxLength(1000)
                .HasColumnName("note");
            entity.Property(e => e.RiskAssessmentId).HasColumnName("risk_assessment_id");
            entity.Property(e => e.Score)
                .HasColumnType("decimal(6, 2)")
                .HasColumnName("score");

            entity.HasOne(d => d.RiskAssessment).WithMany(p => p.RiskFactors)
                .HasForeignKey(d => d.RiskAssessmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_risk_factors_assessment");
        });

        modelBuilder.Entity<RiskModel>(entity =>
        {
            entity.HasKey(e => e.RiskModelId).HasName("PK__risk_mod__AB8C62F60576F493");

            entity.ToTable("risk_models");

            entity.HasIndex(e => e.ModelCode, "UQ__risk_mod__06FA0EEF499BD1B1").IsUnique();

            entity.Property(e => e.RiskModelId).HasColumnName("risk_model_id");
            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.ModelCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("model_code");
            entity.Property(e => e.ModelName)
                .HasMaxLength(150)
                .HasColumnName("model_name");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__roles__760965CC4136571B");

            entity.ToTable("roles");

            entity.HasIndex(e => e.RoleCode, "UQ__roles__BAE630754083997B").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.RoleCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("role_code");
            entity.Property(e => e.RoleName)
                .HasMaxLength(100)
                .HasColumnName("role_name");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => e.RolePermissionId).HasName("PK__role_per__B1E85A10C4D96403");

            entity.ToTable("role_permissions");

            entity.HasIndex(e => new { e.RoleId, e.PermissionId }, "uq_role_permission").IsUnique();

            entity.Property(e => e.RolePermissionId).HasColumnName("role_permission_id");
            entity.Property(e => e.PermissionId).HasColumnName("permission_id");
            entity.Property(e => e.RoleId).HasColumnName("role_id");

            entity.HasOne(d => d.Permission).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.PermissionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_role_permissions_permission");

            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_role_permissions_role");
        });

        modelBuilder.Entity<SystemSetting>(entity =>
        {
            entity.HasKey(e => e.SettingId).HasName("PK__system_s__256E1E32AF0801E5");

            entity.ToTable("system_settings");

            entity.HasIndex(e => e.SettingKey, "UQ__system_s__0DFAC4275DDB209D").IsUnique();

            entity.Property(e => e.SettingId).HasColumnName("setting_id");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .HasColumnName("description");
            entity.Property(e => e.SettingGroup)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("setting_group");
            entity.Property(e => e.SettingKey)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("setting_key");
            entity.Property(e => e.SettingValue).HasColumnName("setting_value");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("updated_at");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.SystemSettings)
                .HasForeignKey(d => d.UpdatedBy)
                .HasConstraintName("fk_settings_user");
        });

        modelBuilder.Entity<TreatmentMethod>(entity =>
        {
            entity.HasKey(e => e.TreatmentMethodId).HasName("PK__treatmen__0F93B959F4361B85");

            entity.ToTable("treatment_methods");

            entity.HasIndex(e => e.MethodCode, "UQ__treatmen__151BA0F058081395").IsUnique();

            entity.Property(e => e.TreatmentMethodId).HasColumnName("treatment_method_id");
            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.MethodCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("method_code");
            entity.Property(e => e.MethodName)
                .HasMaxLength(150)
                .HasColumnName("method_name");
        });

        modelBuilder.Entity<TreatmentPlan>(entity =>
        {
            entity.HasKey(e => e.TreatmentPlanId).HasName("PK__treatmen__E1E75EF9CCEB79BE");

            entity.ToTable("treatment_plans");

            entity.Property(e => e.TreatmentPlanId).HasColumnName("treatment_plan_id");
            entity.Property(e => e.ComplianceTarget)
                .HasMaxLength(500)
                .HasColumnName("compliance_target");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.DoctorId).HasColumnName("doctor_id");
            entity.Property(e => e.DoctorInstruction).HasColumnName("doctor_instruction");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.FollowUpIntervalDays).HasColumnName("follow_up_interval_days");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.PlanName)
                .HasMaxLength(255)
                .HasColumnName("plan_name");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("ACTIVE")
                .HasColumnName("status");
            entity.Property(e => e.TreatmentGoal)
                .HasMaxLength(1000)
                .HasColumnName("treatment_goal");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");

            entity.HasOne(d => d.Doctor).WithMany(p => p.TreatmentPlans)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_treatment_plans_doctor");

            entity.HasOne(d => d.Patient).WithMany(p => p.TreatmentPlans)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_treatment_plans_patient");

            entity.HasOne(d => d.Visit).WithMany(p => p.TreatmentPlans)
                .HasForeignKey(d => d.VisitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_treatment_plans_visit");
        });

        modelBuilder.Entity<TreatmentPlanItem>(entity =>
        {
            entity.HasKey(e => e.TreatmentPlanItemId).HasName("PK__treatmen__CDB3D5DE8D2F2BDF");

            entity.ToTable("treatment_plan_items");

            entity.Property(e => e.TreatmentPlanItemId).HasColumnName("treatment_plan_item_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.DosageOrSpecification)
                .HasMaxLength(500)
                .HasColumnName("dosage_or_specification");
            entity.Property(e => e.Frequency)
                .HasMaxLength(255)
                .HasColumnName("frequency");
            entity.Property(e => e.Instruction).HasColumnName("instruction");
            entity.Property(e => e.ItemName)
                .HasMaxLength(255)
                .HasColumnName("item_name");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("ACTIVE")
                .HasColumnName("status");
            entity.Property(e => e.TreatmentMethodId).HasColumnName("treatment_method_id");
            entity.Property(e => e.TreatmentPlanId).HasColumnName("treatment_plan_id");

            entity.HasOne(d => d.TreatmentMethod).WithMany(p => p.TreatmentPlanItems)
                .HasForeignKey(d => d.TreatmentMethodId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_treatment_items_method");

            entity.HasOne(d => d.TreatmentPlan).WithMany(p => p.TreatmentPlanItems)
                .HasForeignKey(d => d.TreatmentPlanId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_treatment_items_plan");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__users__B9BE370FDBA77DDD");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "UQ__users__AB6E616464A05DC3").IsUnique();

            entity.HasIndex(e => e.Username, "UQ__users__F3DBC57299DBFF0A").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(500)
                .HasColumnName("avatar_url");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(150)
                .HasColumnName("full_name");
            entity.Property(e => e.Gender)
                .HasMaxLength(20)
                .HasColumnName("gender");
            entity.Property(e => e.LastLoginAt).HasColumnName("last_login_at");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(500)
                .HasColumnName("password_hash");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("ACTIVE")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.Username)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("username");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.UserRoleId).HasName("PK__user_rol__B8D9ABA27F805BF4");

            entity.ToTable("user_roles");

            entity.HasIndex(e => new { e.UserId, e.RoleId }, "uq_user_role").IsUnique();

            entity.Property(e => e.UserRoleId).HasColumnName("user_role_id");
            entity.Property(e => e.AssignedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("assigned_at");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Role).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_user_roles_role");

            entity.HasOne(d => d.User).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_user_roles_user");
        });

        modelBuilder.Entity<Visit>(entity =>
        {
            entity.HasKey(e => e.VisitId).HasName("PK__visits__375A75E11FF86CD9");

            entity.ToTable("visits");

            entity.HasIndex(e => e.VisitCode, "UQ__visits__6B282A41F54B36B5").IsUnique();

            entity.Property(e => e.VisitId).HasColumnName("visit_id");
            entity.Property(e => e.AssignedDoctorId).HasColumnName("assigned_doctor_id");
            entity.Property(e => e.ChiefComplaint)
                .HasMaxLength(1000)
                .HasColumnName("chief_complaint");
            entity.Property(e => e.ClinicId).HasColumnName("clinic_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("CREATED")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.VisitCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("visit_code");
            entity.Property(e => e.VisitDate)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("visit_date");
            entity.Property(e => e.VisitType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("INITIAL")
                .HasColumnName("visit_type");

            entity.HasOne(d => d.AssignedDoctor).WithMany(p => p.VisitAssignedDoctors)
                .HasForeignKey(d => d.AssignedDoctorId)
                .HasConstraintName("fk_visits_doctor");

            entity.HasOne(d => d.Clinic).WithMany(p => p.Visits)
                .HasForeignKey(d => d.ClinicId)
                .HasConstraintName("fk_visits_clinic");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.VisitCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("fk_visits_created_by");

            entity.HasOne(d => d.Patient).WithMany(p => p.Visits)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_visits_patient");
        });

        modelBuilder.Entity<VisitApproval>(entity =>
        {
            entity.HasKey(e => e.ApprovalId).HasName("PK__visit_ap__C94AE61A2D4E15AA");

            entity.ToTable("visit_approvals");

            entity.Property(e => e.ApprovalId).HasColumnName("approval_id");
            entity.Property(e => e.ApprovalNote)
                .HasMaxLength(1000)
                .HasColumnName("approval_note");
            entity.Property(e => e.ApprovalStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("APPROVED")
                .HasColumnName("approval_status");
            entity.Property(e => e.ApprovedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("approved_at");
            entity.Property(e => e.ApprovedBy).HasColumnName("approved_by");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.VisitApprovals)
                .HasForeignKey(d => d.ApprovedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_visit_approvals_user");

            entity.HasOne(d => d.Visit).WithMany(p => p.VisitApprovals)
                .HasForeignKey(d => d.VisitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_visit_approvals_visit");
        });

        modelBuilder.Entity<VisitStatusLog>(entity =>
        {
            entity.HasKey(e => e.StatusLogId).HasName("PK__visit_st__9523D868893A7C2E");

            entity.ToTable("visit_status_logs");

            entity.Property(e => e.StatusLogId).HasColumnName("status_log_id");
            entity.Property(e => e.ChangedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("changed_at");
            entity.Property(e => e.ChangedBy).HasColumnName("changed_by");
            entity.Property(e => e.NewStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("new_status");
            entity.Property(e => e.Note)
                .HasMaxLength(1000)
                .HasColumnName("note");
            entity.Property(e => e.OldStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("old_status");
            entity.Property(e => e.VisitId).HasColumnName("visit_id");

            entity.HasOne(d => d.ChangedByNavigation).WithMany(p => p.VisitStatusLogs)
                .HasForeignKey(d => d.ChangedBy)
                .HasConstraintName("fk_visit_status_logs_user");

            entity.HasOne(d => d.Visit).WithMany(p => p.VisitStatusLogs)
                .HasForeignKey(d => d.VisitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_visit_status_logs_visit");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}


