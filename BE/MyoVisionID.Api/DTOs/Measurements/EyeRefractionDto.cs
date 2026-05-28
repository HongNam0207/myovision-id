namespace MyoVisionID.Api.DTOs.Measurements;

public class EyeRefractionDto
{
    public long RefractionId { get; set; }
    public long VisitId { get; set; }
    public long PatientId { get; set; }
    public string EyeSide { get; set; } = null!;
    public string MeasurementType { get; set; } = null!;
    public decimal? Sph { get; set; }
    public decimal? Cyl { get; set; }
    public int? AxisDegree { get; set; }
    public string? Va { get; set; }
    public string? Bcva { get; set; }
    public decimal? Ser { get; set; }
    public string? Note { get; set; }
}

