using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.Parents;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api/parents")]
[Authorize(Roles = "ADMIN,NURSE")]
public class ParentsController : ControllerBase
{
    private readonly IParentService _service;

    public ParentsController(IParentService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetAllAsync()));
    }

    [HttpGet("{parentId:long}")]
    public async Task<IActionResult> GetById(long parentId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetByIdAsync(parentId)));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateParentDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.CreateAsync(request)));
    }

    [HttpPut("{parentId:long}")]
    public async Task<IActionResult> Update(long parentId, UpdateParentDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.UpdateAsync(parentId, request)));
    }
}
