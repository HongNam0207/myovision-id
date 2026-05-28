using MyoVisionID.Api.DTOs.ParentPortal;

namespace MyoVisionID.Api.Services.Interfaces;

public interface IParentPortalService
{
    Task<List<ParentChildDto>> GetMyChildrenAsync();
    Task<object> GetChildProfileAsync(long patientId);
    Task<object> GetChildVisitsAsync(long patientId);
    Task<object> GetChildProgressAsync(long patientId);
    Task<object> GetChildTreatmentPlanAsync(long patientId);
    Task<object> GetChildReportsAsync(long patientId);
    Task<object> GetChildNotificationsAsync(long patientId);
    Task<object> GetChildAppointmentsAsync(long patientId);
    Task<object> CheckAccessAsync(long patientId);
}
