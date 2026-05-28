namespace MyoVisionID.Api.Entities;

public partial class UserClinic
{
    public long UserClinicId { get; set; }
    public long UserId { get; set; }
    public long ClinicId { get; set; }
    public DateTime? AssignedAt { get; set; }

    public virtual User User { get; set; } = null!;
    public virtual Clinic Clinic { get; set; } = null!;
}

