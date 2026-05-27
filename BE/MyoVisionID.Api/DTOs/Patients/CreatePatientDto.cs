using System.ComponentModel.DataAnnotations;

namespace MyoVisionID.Api.DTOs.Patients;

public class CreatePatientDto
{
    [Required]
    public string PatientCode { get; set; } = string.Empty;

    public string? HospitalPatientCode { get; set; }

    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public DateOnly DateOfBirth { get; set; }

    public string? Gender { get; set; }
    public string? Address { get; set; }
    public string? SchoolName { get; set; }
    public string? Grade { get; set; }

    [Required]
    public long ClinicId { get; set; }
}
