using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.Notifications;

public class CreateParentNotificationDto
{
    [Range(1, long.MaxValue)]
    public long ParentId { get; set; }

    [Range(1, long.MaxValue)]
    public long? PatientId { get; set; }

    [Required]
    [StringLength(255, MinimumLength = 2)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(4000, MinimumLength = 2)]
    public string Content { get; set; } = string.Empty;

    [Required]
    [RegularExpression(ValidationRegex.NotificationType)]
    public string NotificationType { get; set; } = "SYSTEM";
}
