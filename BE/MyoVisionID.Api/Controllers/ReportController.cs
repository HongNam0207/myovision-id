using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyoVisionID.Api.Common.Models;
using MyoVisionID.Api.DTOs.Reports;
using MyoVisionID.Api.Services.Interfaces;

namespace MyoVisionID.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class ReportController : ControllerBase
{
    private readonly IReportService _service;

    public ReportController(IReportService service)
    {
        _service = service;
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpGet("visits/{visitId:long}/reports")]
    public async Task<IActionResult> GetVisitReports(long visitId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetVisitReportsAsync(visitId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPost("visits/{visitId:long}/reports/generate")]
    public async Task<IActionResult> GenerateReport(long visitId, GenerateReportDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GenerateReportAsync(visitId, request)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST,PARENT")]
    [HttpGet("reports/{reportId:long}")]
    public async Task<IActionResult> GetReport(long reportId)
    {
        return Ok(ApiResponse<object>.Ok(await _service.GetReportAsync(reportId)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPatch("reports/{reportId:long}/visibility")]
    public async Task<IActionResult> UpdateVisibility(long reportId, [FromQuery] bool visible)
    {
        return Ok(ApiResponse<object>.Ok(await _service.UpdateVisibilityAsync(reportId, visible)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST")]
    [HttpPost("reports/{reportId:long}/upload-pdf")]
    public async Task<IActionResult> UploadPdf(long reportId, UploadReportPdfDto request)
    {
        return Ok(ApiResponse<object>.Ok(await _service.UploadPdfAsync(reportId, request)));
    }

    [Authorize(Roles = "ADMIN,OPHTHALMOLOGIST,PARENT")]
    [HttpGet("reports/{reportId:long}/download")]
    public async Task<IActionResult> DownloadReport(long reportId)
    {
        var report = await _service.GetReportAsync(reportId);

        if (!string.IsNullOrWhiteSpace(report.PdfUrl))
        {
            return Ok(ApiResponse<object>.Ok(new
            {
                report.ReportId,
                report.ReportTitle,
                DownloadUrl = report.PdfUrl
            }));
        }

        return Ok(ApiResponse<object>.Ok(new
        {
            report.ReportId,
            report.ReportTitle,
            Content = report.ReportContent
        }));
    }
}

