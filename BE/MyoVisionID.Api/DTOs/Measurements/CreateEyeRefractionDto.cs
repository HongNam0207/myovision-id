namespace MyoVisionID.Api.DTOs.Measurements;

public class CreateEyeRefractionDto
{
    public string EyeSide { get; set; } = null!;
    public string MeasurementType { get; set; } = null!;
    public decimal? Sph { get; set; }
    public decimal? Cyl { get; set; }
    public int? AxisDegree { get; set; }
    public string? Va { get; set; }
    public string? Bcva { get; set; }
    public string? Note { get; set; }
}
