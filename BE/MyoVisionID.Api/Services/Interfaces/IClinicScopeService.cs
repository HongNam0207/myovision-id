namespace MyoVisionID.Api.Services.Interfaces;

public interface IClinicScopeService
{
    Task<bool> CanAccessClinicAsync(long clinicId);
    Task<List<long>> GetAccessibleClinicIdsAsync();
}
