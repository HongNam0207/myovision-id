namespace MyoVisionID.Api.DTOs.Parents;

public class ParentAccessCheckDto
{
    public long ParentId { get; set; }
    public long PatientId { get; set; }
    public bool HasAccess { get; set; }
}

