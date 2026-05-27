using MyoVisionID.Api.DTOs.UserClinics;

namespace MyoVisionID.Api.Services.Interfaces;

public interface IUserClinicService
{
    Task<List<UserClinicResponseDto>> GetByUserAsync(long userId);
    Task AssignAsync(long userId, long clinicId);
    Task RemoveAsync(long userId, long clinicId);
    Task<bool> UserHasClinicAccessAsync(long userId, long clinicId);
}
