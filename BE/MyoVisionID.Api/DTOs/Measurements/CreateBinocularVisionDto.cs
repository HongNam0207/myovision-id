namespace MyoVisionID.Api.DTOs.Measurements;

public class CreateBinocularVisionDto
{
    public decimal? AaOd { get; set; }
    public decimal? AaOs { get; set; }
    public decimal? MemOd { get; set; }
    public decimal? MemOs { get; set; }
    public decimal? FacilityOd { get; set; }
    public decimal? FacilityOs { get; set; }
    public string? CoverTestDistance { get; set; }
    public string? CoverTestNear { get; set; }
    public decimal? AcARatio { get; set; }
    public decimal? NpcCm { get; set; }
    public string? Note { get; set; }
}
