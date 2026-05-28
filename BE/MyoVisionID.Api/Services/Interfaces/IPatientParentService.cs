namespace MyoVisionID.Api.Services.Interfaces;

public interface IPatientParentService
{
    Task AssignAsync(long patientId, long parentId, bool isPrimaryContact, bool canLogin);
    Task RemoveAsync(long patientId, long parentId);
}

