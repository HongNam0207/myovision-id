namespace MyoVisionID.Api.Services.Interfaces;

public interface IDashboardService
{
    Task<object> GetAdminOverviewAsync();
    Task<object> GetDoctorTodayVisitsAsync();
    Task<object> GetNurseWaitingIntakeAsync();
    Task<object> GetOptometristWaitingMeasurementAsync();
    Task<object> GetParentChildrenSummaryAsync();
}

