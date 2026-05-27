namespace MyoVisionID.Api.DTOs.Patients;

public class UpdatePatientDto
{
    public string FullName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
    public string? SchoolName { get; set; }
    public string? Grade { get; set; }
    public string Status { get; set; } = "ACTIVE";
}
