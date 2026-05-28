using System.Net;
using System.Text.Json;
using MyoVisionID.Api.Common.Models;

namespace MyoVisionID.Api.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (UnauthorizedAccessException ex)
            {
                await WriteError(context, HttpStatusCode.Unauthorized, ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                await WriteError(context, HttpStatusCode.NotFound, ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                await WriteError(context, HttpStatusCode.Conflict, ex.Message);
            }
            catch (Exception ex)
            {
                await WriteError(context, HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        private static async Task WriteError(HttpContext context, HttpStatusCode status, string message)
        {
            context.Response.StatusCode = (int)status;
            context.Response.ContentType = "application/json";

            var response = ApiResponse<string>.Fail(message);

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}

