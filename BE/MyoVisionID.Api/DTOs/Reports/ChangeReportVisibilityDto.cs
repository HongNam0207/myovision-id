using System.ComponentModel.DataAnnotations;

namespace MyoVisionID.Api.DTOs.Reports;

public class ChangeReportVisibilityDto
{
    [Required]
    public bool IsVisibleToParent { get; set; }
}

