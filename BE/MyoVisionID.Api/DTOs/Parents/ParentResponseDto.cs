namespace MyoVisionID.Api.DTOs.Parents;

public class ParentResponseDto
{
    public long ParentId { get; set; }
    public long? UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Relationship { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? IdentityNumber { get; set; }
}

