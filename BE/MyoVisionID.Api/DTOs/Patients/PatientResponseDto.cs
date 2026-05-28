namespace MyoVisionID.Api.DTOs.Patients;

public class PatientResponseDto
{
    public long PatientId { get; set; }
    public string PatientCode { get; set; } = string.Empty;
    public string? HospitalPatientCode { get; set; }
    public string FullName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
    public string? SchoolName { get; set; }
    public string? Grade { get; set; }
    public long? ClinicId { get; set; }
    public string? ClinicName { get; set; }
    public string Status { get; set; } = "ACTIVE";
    public DateTime? CreatedAt { get; set; }
}

