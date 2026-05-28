using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;
using MyoVisionID.Api.Common.Validation;

namespace MyoVisionID.Api.DTOs.Patients;

public class CreatePatientDto
{
    [Required]
    [StringLength(50, MinimumLength = 2)]
    [RegularExpression(ValidationRegex.Code)]
    public string PatientCode { get; set; } = string.Empty;

    [StringLength(50)]
    public string? HospitalPatientCode { get; set; }

    [Required]
    [StringLength(150, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [NotFutureDate]
    public DateOnly DateOfBirth { get; set; }

    [RegularExpression(ValidationRegex.Gender)]
    public string? Gender { get; set; }

    [StringLength(500)]
    public string? Address { get; set; }

    [StringLength(255)]
    public string? SchoolName { get; set; }

    [StringLength(50)]
    public string? Grade { get; set; }

    [Range(1, long.MaxValue)]
    public long ClinicId { get; set; }
}

