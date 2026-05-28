namespace MyoVisionID.Api.Services.Interfaces;

using MyoVisionID.Api.DTOs.Progress;

public interface IProgressService
{
    Task<List<FollowUpDto>> GetFollowUpsAsync(long patientId);
    Task<FollowUpDto> CreateFollowUpAsync(long patientId, CreateFollowUpDto request);

    Task<List<ProgressSnapshotDto>> GetProgressSnapshotsAsync(long patientId);
    Task<ProgressSnapshotDto> GenerateSnapshotAsync(long patientId, long visitId);
    Task<object> GetProgressChartAsync(long patientId);
    Task<object> CompareVisitsAsync(long patientId, long fromVisitId, long toVisitId);
}
