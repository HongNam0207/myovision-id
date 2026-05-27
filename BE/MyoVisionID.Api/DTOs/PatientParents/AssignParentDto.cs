namespace MyoVisionID.Api.DTOs.PatientParents;

public class AssignParentDto
{
    public long ParentId { get; set; }
    public bool IsPrimaryContact { get; set; }
    public bool CanLogin { get; set; } = true;
}
