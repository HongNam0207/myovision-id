using System.Security.Claims;

namespace MyoVisionID.Api.Services.Interfaces;

public interface ICurrentUserService
{
    long UserId { get; }
    string? Username { get; }
    bool IsAuthenticated { get; }
    bool IsInRole(string role);
}

