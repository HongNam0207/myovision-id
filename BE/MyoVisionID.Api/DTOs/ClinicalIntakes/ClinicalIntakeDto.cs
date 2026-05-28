namespace MyoVisionID.Api.DTOs.ClinicalIntakes;

public class ClinicalIntakeDto
{
    public long IntakeId { get; set; }
    public long VisitId { get; set; }
    public long PatientId { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? WeightKg { get; set; }
    public string? BloodPressure { get; set; }
    public string? ReasonForVisit { get; set; }
    public decimal? AgeMyopiaDetected { get; set; }
    public string? CurrentGlassesPower { get; set; }
    public string? PreviousTreatment { get; set; }
    public bool? FatherHasMyopia { get; set; }
    public bool? MotherHasMyopia { get; set; }
    public bool? SiblingHasMyopia { get; set; }
    public string? FamilyHistoryNote { get; set; }
    public decimal? NearWorkHoursPerDay { get; set; }
    public decimal? OutdoorHoursPerDay { get; set; }
    public decimal? ScreenTimeHoursPerDay { get; set; }
    public decimal? ReadingDistanceCm { get; set; }
    public string? AllergyHistory { get; set; }
    public string? SystemicDiseaseHistory { get; set; }
    public string? EyeDiseaseHistory { get; set; }
    public long? EnteredBy { get; set; }
    public string? EnteredByName { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

