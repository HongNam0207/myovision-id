using System.ComponentModel.DataAnnotations;

namespace MyoVisionID.Api.DTOs.Clinics;

public class CreateClinicDto
{
    [Required] public string ClinicCode { get; set; } = string.Empty;
    [Required] public string ClinicName { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public long? ManagerUserId { get; set; }
}
