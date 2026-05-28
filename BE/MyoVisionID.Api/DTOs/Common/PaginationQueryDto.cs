using System.ComponentModel.DataAnnotations;

namespace MyoVisionID.Api.DTOs.Common;

public class PaginationQueryDto
{
    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 10;

    [StringLength(100)]
    public string? Keyword { get; set; }

    [StringLength(50)]
    public string? SortBy { get; set; }

    public bool IsDescending { get; set; } = false;
}
