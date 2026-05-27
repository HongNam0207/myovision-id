namespace MyoVisionID.Api.DTOs.Visits;

public class UpdateVisitDto
{
    public string VisitType { get; set; } = "INITIAL";
    public string? ChiefComplaint { get; set; }
    public long? AssignedDoctorId { get; set; }
}
