namespace MyoVisionID.Api.DTOs.DoctorCore;

public class CreateDoctorNoteDto
{
    public string? NoteType { get; set; }
    public string? NoteContent { get; set; }
    public bool IsInternal { get; set; } = true;
}

