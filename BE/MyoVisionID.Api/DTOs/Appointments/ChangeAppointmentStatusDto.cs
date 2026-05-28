using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.Appointments;

public class ChangeAppointmentStatusDto
{
    [Required]
    [RegularExpression(ValidationRegex.AppointmentStatus)]
    public string Status { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Note { get; set; }
}
