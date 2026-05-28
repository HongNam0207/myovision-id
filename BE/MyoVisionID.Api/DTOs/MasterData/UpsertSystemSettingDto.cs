using System.ComponentModel.DataAnnotations;
using MyoVisionID.Api.Common.Constants;

namespace MyoVisionID.Api.DTOs.MasterData;

public class UpsertSystemSettingDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    [RegularExpression(ValidationRegex.Code)]
    public string SettingKey { get; set; } = string.Empty;

    [Required]
    [StringLength(4000)]
    public string SettingValue { get; set; } = string.Empty;

    [Required]
    [RegularExpression(ValidationRegex.SettingGroup)]
    public string SettingGroup { get; set; } = "SYSTEM";

    [StringLength(500)]
    public string? Description { get; set; }
}

