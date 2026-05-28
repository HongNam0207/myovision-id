namespace MyoVisionID.Api.DTOs.Progress;

public class ProgressSnapshotDto
{
    public long ProgressSnapshotId { get; set; }
    public long PatientId { get; set; }
    public long? VisitId { get; set; }
    public DateOnly SnapshotDate { get; set; }
    public decimal? SerOd { get; set; }
    public decimal? SerOs { get; set; }
    public decimal? AxialLengthOd { get; set; }
    public decimal? AxialLengthOs { get; set; }
    public string? VaOd { get; set; }
    public string? VaOs { get; set; }
    public decimal? IopOd { get; set; }
    public decimal? IopOs { get; set; }
    public decimal? AlGrowthOd { get; set; }
    public decimal? AlGrowthOs { get; set; }
    public decimal? SerChangeOd { get; set; }
    public decimal? SerChangeOs { get; set; }
    public string? ProgressionNote { get; set; }
    public DateTime? CreatedAt { get; set; }
}
