namespace MyoVisionID.Api.DTOs.Appointments;

public class NotificationDto
{
    public long NotificationId { get; set; }
    public long ParentId { get; set; }
    public long? PatientId { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public string? NotificationType { get; set; }
    public bool IsRead { get; set; }
    public DateTime? CreatedAt { get; set; }
}

