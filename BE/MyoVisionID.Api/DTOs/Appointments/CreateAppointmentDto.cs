using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;
using MyoVisionID.Api.Common.Validation;

namespace MyoVisionID.Api.DTOs.Appointments;

public class CreateAppointmentDto
{
    [Range(1, long.MaxValue)]
    public long PatientId { get; set; }

    [Range(1, long.MaxValue)]
    public long? ParentId { get; set; }

    [Range(1, long.MaxValue)]
    public long? ClinicId { get; set; }

    [Range(1, long.MaxValue)]
    public long? DoctorId { get; set; }

    [Required]
    [NotPastDateTime]
    public DateTime AppointmentDatetime { get; set; }

    [Required]
    [RegularExpression(ValidationRegex.AppointmentType)]
    public string AppointmentType { get; set; } = "FOLLOW_UP";

    [StringLength(1000)]
    public string? Reason { get; set; }

    [StringLength(1000)]
    public string? Note { get; set; }
}


