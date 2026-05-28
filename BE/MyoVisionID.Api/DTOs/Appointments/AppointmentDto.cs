namespace MyoVisionID.Api.DTOs.Appointments;

public class AppointmentDto
{
    public long AppointmentId { get; set; }
    public long PatientId { get; set; }
    public long? ParentId { get; set; }
    public long? ClinicId { get; set; }
    public long? DoctorId { get; set; }
    public DateTime AppointmentDatetime { get; set; }
    public string? AppointmentType { get; set; }
    public string? Status { get; set; }
    public string? Reason { get; set; }
    public string? Note { get; set; }
    public long? CreatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
