using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;
using MyoVisionID.Api.Common.Validation;

namespace MyoVisionID.Api.DTOs.Appointments;

public class UpdateAppointmentDto
{
    [Required]
    [NotPastDateTime]
    public DateTime AppointmentDatetime { get; set; }

    [Required]
    [RegularExpression(ValidationRegex.AppointmentType)]
    public string AppointmentType { get; set; } = "FOLLOW_UP";

    [Required]
    [RegularExpression(ValidationRegex.AppointmentStatus)]
    public string Status { get; set; } = "BOOKED";

    [StringLength(1000)]
    public string? Reason { get; set; }

    [StringLength(1000)]
    public string? Note { get; set; }
}

