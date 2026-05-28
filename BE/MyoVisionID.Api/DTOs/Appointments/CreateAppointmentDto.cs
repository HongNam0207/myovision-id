namespace MyoVisionID.Api.DTOs.Appointments;

public class CreateAppointmentDto
{
    public long PatientId { get; set; }
    public long? ParentId { get; set; }
    public long? ClinicId { get; set; }
    public long? DoctorId { get; set; }
    public DateTime AppointmentDatetime { get; set; }
    public string? AppointmentType { get; set; }
    public string? Reason { get; set; }
    public string? Note { get; set; }
}
