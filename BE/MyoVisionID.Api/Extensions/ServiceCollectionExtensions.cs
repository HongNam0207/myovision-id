using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MyoVisionID.Api.Authorization;
using MyoVisionID.Api.Common.Constants;
using MyoVisionID.Api.Services;
using MyoVisionID.Api.Services.Interfaces;
using System.Text;

namespace MyoVisionID.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IAuthorizationHandler, PermissionHandler>();

            return services;
        }

        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var key = configuration["Jwt:Key"] ?? "MyoVisionID_Development_Key_Change_This_At_Least_32_Characters";
            var issuer = configuration["Jwt:Issuer"] ?? "MyoVisionID";
            var audience = configuration["Jwt:Audience"] ?? "MyoVisionIDClient";

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = issuer,
                        ValidAudience = audience,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
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
