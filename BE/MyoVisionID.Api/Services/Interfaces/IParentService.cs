using MyoVisionID.Api.DTOs.Parents;

namespace MyoVisionID.Api.Services.Interfaces;

public interface IParentService
{
    Task<List<ParentResponseDto>> GetAllAsync();
    Task<ParentResponseDto> GetByIdAsync(long parentId);
    Task<ParentResponseDto> CreateAsync(CreateParentDto request);
    Task<ParentResponseDto> UpdateAsync(long parentId, UpdateParentDto request);
}

