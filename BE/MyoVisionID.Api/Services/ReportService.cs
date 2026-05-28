using Microsoft.EntityFrameworkCore;
using System.Text;
using MyoVisionID.Api.Data;
using MyoVisionID.Api.DTOs.Reports;
using MyoVisionID.Api.Entities;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Services;

public class ReportService : IReportService
{
    private readonly AppDbContext _context;
    private readonly IClinicScopeService _clinicScope;
    private readonly ICurrentUserService _currentUser;

    public ReportService(
        AppDbContext context,
        IClinicScopeService clinicScope,
        ICurrentUserService currentUser)
    {
        _context = context;
        _clinicScope = clinicScope;
        _currentUser = currentUser;
    }

    public async Task<List<MedicalReportDto>> GetVisitReportsAsync(long visitId)
    {
        var visit = await GetVisitAsync(visitId);

        return await _context.MedicalReports
            .Where(x => x.VisitId == visit.VisitId)
            .OrderByDescending(x => x.GeneratedAt)
            .Select(x => MapReport(x))
            .ToListAsync();
    }

    public async Task<MedicalReportDto> GetReportAsync(long reportId)
    {
        var report = await GetReportEntityAsync(reportId);
        return MapReport(report);
    }

    public async Task<MedicalReportDto> GenerateReportAsync(long visitId, GenerateReportDto request)
    {
        var visit = await GetVisitAsync(visitId);

        var patient = await _context.Patients.FirstOrDefaultAsync(x => x.PatientId == visit.PatientId);
        var intake = await _context.ClinicalIntakes.FirstOrDefaultAsync(x => x.VisitId == visitId);
        var refractions = await _context.EyeRefractions.Where(x => x.VisitId == visitId).ToListAsync();
        var biometrics = await _context.EyeBiometrics.Where(x => x.VisitId == visitId).ToListAsync();
        var risk = await _context.RiskAssessments.FirstOrDefaultAsync(x => x.VisitId == visitId);
        var diagnosis = await _context.DoctorDiagnoses.FirstOrDefaultAsync(x => x.VisitId == visitId);
        var treatment = await _context.TreatmentPlans.FirstOrDefaultAsync(x => x.VisitId == visitId);

        var content = BuildReportContent(
            visit,
            patient,
            intake,
            refractions,
            biometrics,
            risk,
            diagnosis,
            treatment);

        var entity = new MedicalReport
        {
            VisitId = visit.VisitId,
            PatientId = visit.PatientId,
            ReportType = string.IsNullOrWhiteSpace(request.ReportType) ? "VISIT_SUMMARY" : request.ReportType,
            ReportTitle = string.IsNullOrWhiteSpace(request.ReportTitle)
                ? $"Visit Summary Report - {visit.VisitCode}"
                : request.ReportTitle,
            ReportContent = content,
            IsVisibleToParent = request.IsVisibleToParent,
            GeneratedBy = _currentUser.UserId,
            GeneratedAt = DateTime.UtcNow.AddHours(7)
        };

        _context.MedicalReports.Add(entity);
        await _context.SaveChangesAsync();

        return MapReport(entity);
    }

    public async Task<MedicalReportDto> UpdateVisibilityAsync(long reportId, bool visible)
    {
        var report = await GetReportEntityAsync(reportId);

        report.IsVisibleToParent = visible;
        await _context.SaveChangesAsync();

        return MapReport(report);
    }

    public async Task<MedicalReportDto> UploadPdfAsync(long reportId, UploadReportPdfDto request)
    {
        var report = await GetReportEntityAsync(reportId);

        if (string.IsNullOrWhiteSpace(request.PdfUrl))
            throw new InvalidOperationException("PdfUrl is required.");

        report.PdfUrl = request.PdfUrl;
        await _context.SaveChangesAsync();

        return MapReport(report);
    }

    private async Task<Visit> GetVisitAsync(long visitId)
    {
        var visit = await _context.Visits.FirstOrDefaultAsync(x => x.VisitId == visitId);

        if (visit == null)
            throw new KeyNotFoundException("Visit not found.");

        if (visit.ClinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(visit.ClinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        return visit;
    }

    private async Task<MedicalReport> GetReportEntityAsync(long reportId)
    {
        var report = await _context.MedicalReports
            .Include(x => x.Visit)
            .FirstOrDefaultAsync(x => x.ReportId == reportId);

        if (report == null)
            throw new KeyNotFoundException("Report not found.");

        if (report.Visit.ClinicId.HasValue && !await _clinicScope.CanAccessClinicAsync(report.Visit.ClinicId.Value))
            throw new UnauthorizedAccessException("Clinic access denied.");

        return report;
    }

    private static string BuildReportContent(
        Visit visit,
        Patient? patient,
        ClinicalIntake? intake,
        List<EyeRefraction> refractions,
        List<EyeBiometric> biometrics,
        RiskAssessment? risk,
        DoctorDiagnosis? diagnosis,
        TreatmentPlan? treatment)
    {
        var sb = new StringBuilder();

        sb.AppendLine("MYOVISION ID - VISIT SUMMARY REPORT");
        sb.AppendLine("----------------------------------");
        sb.AppendLine($"Visit Code: {visit.VisitCode}");
        sb.AppendLine($"Visit Date: {visit.VisitDate:yyyy-MM-dd HH:mm}");
        sb.AppendLine($"Visit Type: {visit.VisitType}");
        sb.AppendLine($"Status: {visit.Status}");
        sb.AppendLine();

        if (patient != null)
        {
            sb.AppendLine("PATIENT");
            sb.AppendLine($"Code: {patient.PatientCode}");
            sb.AppendLine($"Name: {patient.FullName}");
            sb.AppendLine($"DOB: {patient.DateOfBirth}");
            sb.AppendLine($"Gender: {patient.Gender}");
            sb.AppendLine();
        }

        if (intake != null)
        {
            sb.AppendLine("CLINICAL INTAKE");
            sb.AppendLine($"Reason: {intake.ReasonForVisit}");
            sb.AppendLine($"Near Work Hours/Day: {intake.NearWorkHoursPerDay}");
            sb.AppendLine($"Outdoor Hours/Day: {intake.OutdoorHoursPerDay}");
            sb.AppendLine($"Screen Time Hours/Day: {intake.ScreenTimeHoursPerDay}");
            sb.AppendLine();
        }

        sb.AppendLine("REFRACTIONS");
        foreach (var r in refractions)
        {
            sb.AppendLine($"{r.EyeSide} - {r.MeasurementType}: SPH {r.Sph}, CYL {r.Cyl}, AXIS {r.AxisDegree}, SER {r.Ser}, VA {r.Va}");
        }
        sb.AppendLine();

        sb.AppendLine("BIOMETRICS");
        foreach (var b in biometrics)
        {
            sb.AppendLine($"{b.EyeSide}: AL {b.AxialLengthMm}, K1 {b.K1}, K2 {b.K2}, IOP {b.IopMmhg}, AL/CR {b.AlCrRatio}");
        }
        sb.AppendLine();

        if (risk != null)
        {
            sb.AppendLine("RISK ASSESSMENT");
            sb.AppendLine($"Score: {risk.TotalScore}");
            sb.AppendLine($"Level: {risk.RiskLevel}");
            sb.AppendLine($"Recommendation: {risk.Recommendation}");
            sb.AppendLine();
        }

        if (diagnosis != null)
        {
            sb.AppendLine("DIAGNOSIS");
            sb.AppendLine($"Diagnosis: {diagnosis.DiagnosisName}");
            sb.AppendLine($"Conclusion: {diagnosis.ClinicalConclusion}");
            sb.AppendLine($"Severity: {diagnosis.SeverityLevel}");
            sb.AppendLine($"Progression: {diagnosis.ProgressionStatus}");
            sb.AppendLine();
        }

        if (treatment != null)
        {
            sb.AppendLine("TREATMENT PLAN");
            sb.AppendLine($"Plan: {treatment.PlanName}");
            sb.AppendLine($"Goal: {treatment.TreatmentGoal}");
            sb.AppendLine($"Instruction: {treatment.DoctorInstruction}");
            sb.AppendLine();
        }

        return sb.ToString();
    }

    private static MedicalReportDto MapReport(MedicalReport x)
    {
        return new MedicalReportDto
        {
            ReportId = x.ReportId,
            VisitId = x.VisitId,
            PatientId = x.PatientId,
            ReportType = x.ReportType,
            ReportTitle = x.ReportTitle,
            ReportContent = x.ReportContent,
            PdfUrl = x.PdfUrl,
            IsVisibleToParent = x.IsVisibleToParent ?? false,
            GeneratedBy = x.GeneratedBy,
            GeneratedAt = x.GeneratedAt
        };
    }
}

