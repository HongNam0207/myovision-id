using System.ComponentModel.DataAnnotations;

namespace MyoVisionID.Api.DTOs.Visits;

public class CreateVisitDto
{
    [Required]
    public string VisitCode { get; set; } = string.Empty;

    [Required]
    public long PatientId { get; set; }

    public long? ClinicId { get; set; }
    public string VisitType { get; set; } = "INITIAL";
    public string? ChiefComplaint { get; set; }
    public long? AssignedDoctorId { get; set; }
}
