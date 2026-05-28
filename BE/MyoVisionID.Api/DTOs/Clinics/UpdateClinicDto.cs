namespace MyoVisionID.Api.DTOs.Clinics;

public class UpdateClinicDto
{
    public string ClinicName { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public long? ManagerUserId { get; set; }
    public bool IsActive { get; set; } = true;
}

