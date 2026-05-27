using System.ComponentModel.DataAnnotations;

namespace MyoVisionID.Api.DTOs.Parents;

public class CreateParentDto
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    public string? Relationship { get; set; }

    [Required]
    public string Phone { get; set; } = string.Empty;

    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? IdentityNumber { get; set; }
}
