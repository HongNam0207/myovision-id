namespace MyoVisionID.Api.Common.Constants;

public static class ValidationRegex
{
    public const string EyeSide = "^(OD|OS)$";
    public const string Gender = "^(Nam|Nữ|Khác|Male|Female|Other)$";
    public const string VisitType = "^(INITIAL|FOLLOW_UP|EMERGENCY|RECHECK)$";
    public const string VisitStatus = "^(CREATED|WAITING_INTAKE|IN_INTAKE|WAITING_MEASUREMENT|IN_MEASUREMENT|WAITING_DOCTOR|IN_DIAGNOSIS|WAITING_APPROVAL|COMPLETED|CANCELLED)$";
    public const string PatientStatus = "^(ACTIVE|INACTIVE|ARCHIVED)$";
    public const string PhoneVN = "^(0|\\+84)[0-9]{9,10}$";
    public const string Code = "^[A-Z0-9\\-_]{2,50}$";
    public const string Relationship = "^(Bố|Mẹ|Người giám hộ|Khác|Father|Mother|Guardian|Other)$";
    public const string MeasurementType = "^(AUTO_REFRACTION|SUBJECTIVE|CYCLOPLEGIC|RETINOSCOPY)$";
    public const string RiskLevel = "^(LOW|MEDIUM|HIGH)$";
    public const string SeverityLevel = "^(MILD|MODERATE|SEVERE)$";
    public const string ProgressionStatus = "^(STABLE|PROGRESSING|RAPID_PROGRESSING|IMPROVING)$";
    public const string TreatmentPlanStatus = "^(ACTIVE|PAUSED|COMPLETED|CANCELLED)$";
    public const string ComplianceLevel = "^(GOOD|FAIR|POOR|UNKNOWN)$";
    public const string AppointmentType = "^(INITIAL|FOLLOW_UP|RECHECK|CONSULTATION)$";
    public const string AppointmentStatus = "^(BOOKED|CHECKED_IN|COMPLETED|CANCELLED|NO_SHOW)$";
    public const string NotificationType = "^(APPOINTMENT|RISK_ALERT|TREATMENT_REMINDER|REPORT|SYSTEM)$";
    public const string ReportType = "^(VISIT_SUMMARY|TREATMENT_PLAN|PROGRESS|GENERAL)$";

    public const string UserStatus = "^(ACTIVE|INACTIVE|LOCKED|ARCHIVED)$";
    public const string RoleCode = "^(ADMIN|OPHTHALMOLOGIST|OPTOMETRIST|NURSE|PARENT)$";
    public const string SettingGroup = "^(SYSTEM|NOTIFICATION|RISK|REPORT|PORTAL|BACKUP)$";
}
