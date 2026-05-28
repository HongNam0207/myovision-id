namespace MyoVisionID.Api.DTOs.Clinics;

public class ClinicResponseDto
{
    public long ClinicId { get; set; }
    public string ClinicCode { get; set; } = string.Empty;
    public string ClinicName { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public long? ManagerUserId { get; set; }
    public string? ManagerName { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
}

