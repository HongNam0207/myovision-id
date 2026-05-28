using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MyoVisionID.Api.Authorization;
using MyoVisionID.Api.Common.Constants;
using MyoVisionID.Api.Services;
using MyoVisionID.Api.Services.Interfaces;
using System.Text;
using MyoVisionID.Api.Services.Time;
namespace MyoVisionID.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IClinicService, ClinicService>();
            services.AddScoped<IUserClinicService, UserClinicService>();
            services.AddHttpContextAccessor();
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IClinicScopeService, ClinicScopeService>();
            services.AddScoped<IPatientService, PatientService>();
            services.AddScoped<IParentService, ParentService>();
            services.AddScoped<IPatientParentService, PatientParentService>();
            services.AddScoped<IParentPortalService, ParentPortalService>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IVisitService, VisitService>();
            services.AddScoped<IVisitApprovalService, VisitApprovalService>();
            services.AddScoped<IClinicalIntakeService, ClinicalIntakeService>();
            services.AddScoped<IEyeMeasurementService, EyeMeasurementService>();
            services.AddScoped<IDoctorCoreService, DoctorCoreService>();
            services.AddScoped<ITreatmentService, TreatmentService>();
            services.AddScoped<IProgressService, ProgressService>();
            services.AddScoped<IAppointmentService, AppointmentService>();
            services.AddScoped<IAuthorizationHandler, PermissionHandler>();
            services.AddSingleton<IDateTimeService, DateTimeService>();
            return services;
        }

        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var key = configuration["Jwt:Key"]
                ?? "MYOVISION_ID_SUPER_SECRET_KEY_2026_DEVELOPMENT_KEY_32_CHARS";

            var issuer = configuration["Jwt:Issuer"]
                ?? "MyoVisionID";

            var audience = configuration["Jwt:Audience"]
                ?? "MyoVisionIDUsers";

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        ValidIssuer = issuer,
                        ValidAudience = audience,

                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(key)
                        ),

                        ClockSkew = TimeSpan.Zero
                    };
                });

            services.AddAuthorization(options =>
            {
                var permissions = new[]
                {
            PermissionConstants.UsersView,
            PermissionConstants.UsersCreate,
            PermissionConstants.UsersUpdate,
            PermissionConstants.UsersDelete,
            PermissionConstants.RolesView,
            PermissionConstants.RolesCreate,
            PermissionConstants.RolesUpdate,
            PermissionConstants.RolesDelete,
            PermissionConstants.PermissionsView,
            PermissionConstants.RolePermissionsManage,
            PermissionConstants.UserRolesManage
        };

                foreach (var permission in permissions)
                {
                    options.AddPolicy($"Permission:{permission}", policy =>
                    {
                        policy.Requirements.Add(new PermissionRequirement(permission));
                    });
                }
            });

            return services;
        }

        public static IServiceCollection AddSwaggerWithJwt(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "MyoVisionID API",
                    Version = "v1"
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Nhap JWT token, khong can ghi chu Bearer."
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            return services;
        }
    }
}















