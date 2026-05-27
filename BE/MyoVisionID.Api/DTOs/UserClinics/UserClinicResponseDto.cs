namespace MyoVisionID.Api.DTOs.UserClinics;

public class UserClinicResponseDto
{
    public long UserClinicId { get; set; }
    public long UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public long ClinicId { get; set; }
    public string ClinicCode { get; set; } = string.Empty;
    public string ClinicName { get; set; } = string.Empty;
    public DateTime? AssignedAt { get; set; }
}
