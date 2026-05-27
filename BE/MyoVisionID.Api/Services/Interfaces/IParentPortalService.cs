using MyoVisionID.Api.DTOs.Parents;

namespace MyoVisionID.Api.Services.Interfaces;

public interface IParentPortalService
{
    Task<bool> ParentCanAccessPatientAsync(long parentUserId, long patientId);
    Task<List<ParentResponseDto>> GetPatientParentsAsync(long patientId);
}
