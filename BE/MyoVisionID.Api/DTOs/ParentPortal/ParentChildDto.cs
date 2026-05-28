namespace MyoVisionID.Api.DTOs.ParentPortal;

public class ParentChildDto
{
    public long PatientId { get; set; }
    public string? PatientCode { get; set; }
    public string FullName { get; set; } = null!;
    public DateOnly DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? SchoolName { get; set; }
    public string? Grade { get; set; }
    public string? Status { get; set; }
}

