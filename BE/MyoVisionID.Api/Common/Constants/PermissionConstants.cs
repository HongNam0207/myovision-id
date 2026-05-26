namespace MyoVisionID.Api.Common.Constants
{
    public static class PermissionConstants
    {
        // USERS
        public const string ViewUsers = "users.view";
        public const string CreateUsers = "users.create";
        public const string UpdateUsers = "users.update";
        public const string DeleteUsers = "users.delete";

        // PATIENTS
        public const string ViewPatients = "patients.view";
        public const string CreatePatients = "patients.create";
        public const string UpdatePatients = "patients.update";
        public const string DeletePatients = "patients.delete";

        // VISITS
        public const string ViewVisits = "visits.view";
        public const string CreateVisits = "visits.create";
        public const string UpdateVisits = "visits.update";
        public const string ApproveVisits = "visits.approve";

        // MEASUREMENTS
        public const string ViewMeasurements = "measurements.view";
        public const string CreateMeasurements = "measurements.create";
        public const string UpdateMeasurements = "measurements.update";

        // RISK ASSESSMENT
        public const string ViewRiskAssessments = "riskassessments.view";
        public const string CreateRiskAssessments = "riskassessments.create";

        // DIAGNOSIS
        public const string ViewDiagnoses = "diagnoses.view";
        public const string CreateDiagnoses = "diagnoses.create";
        public const string UpdateDiagnoses = "diagnoses.update";

        // TREATMENT
        public const string ViewTreatments = "treatments.view";
        public const string CreateTreatments = "treatments.create";
        public const string UpdateTreatments = "treatments.update";

        // REPORTS
        public const string ViewReports = "reports.view";
        public const string GenerateReports = "reports.generate";

        // DASHBOARD
        public const string ViewDashboard = "dashboard.view";

        // SYSTEM
        public const string ManageRoles = "roles.manage";
        public const string ManagePermissions = "permissions.manage";
        public const string ManageClinics = "clinics.manage";
        public const string ManageSettings = "settings.manage";
        public const string ViewAuditLogs = "auditlogs.view";
    }
}