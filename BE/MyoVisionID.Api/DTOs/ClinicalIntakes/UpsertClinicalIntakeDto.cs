using System.ComponentModel.DataAnnotations;

namespace MyoVisionID.Api.DTOs.ClinicalIntakes;

public class UpsertClinicalIntakeDto
{
    [Range(30, 250)]
    public decimal? HeightCm { get; set; }

    [Range(2, 250)]
    public decimal? WeightKg { get; set; }

    [StringLength(30)]
    public string? BloodPressure { get; set; }

    [StringLength(1000)]
    public string? ReasonForVisit { get; set; }

    [Range(0, 30)]
    public decimal? AgeMyopiaDetected { get; set; }

    [StringLength(255)]
    public string? CurrentGlassesPower { get; set; }

    [StringLength(1000)]
    public string? PreviousTreatment { get; set; }

    public bool? FatherHasMyopia { get; set; }
    public bool? MotherHasMyopia { get; set; }
    public bool? SiblingHasMyopia { get; set; }

    [StringLength(1000)]
    public string? FamilyHistoryNote { get; set; }

    [Range(0, 24)]
    public decimal? NearWorkHoursPerDay { get; set; }

    [Range(0, 24)]
    public decimal? OutdoorHoursPerDay { get; set; }

    [Range(0, 24)]
    public decimal? ScreenTimeHoursPerDay { get; set; }

    [Range(5, 200)]
    public decimal? ReadingDistanceCm { get; set; }

    [StringLength(1000)]
    public string? AllergyHistory { get; set; }

    [StringLength(1000)]
    public string? SystemicDiseaseHistory { get; set; }

    [StringLength(1000)]
    public string? EyeDiseaseHistory { get; set; }
}
