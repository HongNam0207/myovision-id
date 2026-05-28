namespace MyoVisionID.Api.DTOs.Appointments;

public class CreateNotificationDto
{
    public long ParentId { get; set; }
    public long? PatientId { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public string? NotificationType { get; set; }
}
