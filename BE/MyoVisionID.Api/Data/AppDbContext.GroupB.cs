using Microsoft.EntityFrameworkCore;
using MyoVisionID.Api.Entities;

namespace MyoVisionID.Api.Data;

public partial class AppDbContext
{
    public virtual DbSet<UserClinic> UserClinics { get; set; }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserClinic>(entity =>
        {
            entity.HasKey(e => e.UserClinicId);
            entity.ToTable("user_clinics");

            entity.HasIndex(e => new { e.UserId, e.ClinicId }).IsUnique();

            entity.Property(e => e.UserClinicId).HasColumnName("user_clinic_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.ClinicId).HasColumnName("clinic_id");
            entity.Property(e => e.AssignedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("assigned_at");

            entity.HasOne(e => e.User)
                .WithMany(e => e.UserClinics)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.Clinic)
                .WithMany(e => e.UserClinics)
                .HasForeignKey(e => e.ClinicId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });
    }
}
