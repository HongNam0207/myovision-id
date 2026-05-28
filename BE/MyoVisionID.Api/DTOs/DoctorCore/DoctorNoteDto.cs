namespace MyoVisionID.Api.DTOs.DoctorCore;

public class DoctorNoteDto
{
    public long DoctorNoteId { get; set; }
    public long VisitId { get; set; }
    public long PatientId { get; set; }
    public long DoctorId { get; set; }
    public string? NoteType { get; set; }
    public string? NoteContent { get; set; }
    public bool IsInternal { get; set; }
    public DateTime? CreatedAt { get; set; }
}
