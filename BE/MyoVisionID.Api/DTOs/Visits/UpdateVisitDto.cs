using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.Visits;

public class UpdateVisitDto
{
    [Required]
    [RegularExpression(ValidationRegex.VisitType)]
    public string VisitType { get; set; } = "INITIAL";

    [StringLength(1000)]
    public string? ChiefComplaint { get; set; }

    [Range(1, long.MaxValue)]
    public long? AssignedDoctorId { get; set; }
}

