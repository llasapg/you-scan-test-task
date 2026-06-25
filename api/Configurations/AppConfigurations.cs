using Api.Data;
using Api.GraphQL;
using Api.Models;
using Api.Services;
using Api.Services.Interfaces;
using Api.Validators;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace api.Configurations;

public static class AppConfigurations
{
    public static void ConfigureDb(this WebApplicationBuilder builder)
    {
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseInMemoryDatabase("DashboardDb"));
    }

    public static void RegisterServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<IWidgetService, WidgetService>();
        builder.Services.AddScoped<IDashboardService, DashboardService>();
        builder.Services.AddValidatorsFromAssemblyContaining<CreateWidgetInputValidator>();
    }

    public static void AddCustomGraphQl(this WebApplicationBuilder builder)
    {
        builder.Services
            .AddGraphQLServer()
            .AddQueryType<Query>()
            .AddMutationType<Mutation>()
            .AddType<Widget>()
            .AddType<Dashboard>()
            .AddType<WidgetType>();
    }

    public static void ConfigureCors(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins(
                        "http://localhost:5173",
                        "http://localhost:3000",
                        "https://gavrafana.com",
                        "https://you-scan-test-task.pages.dev",
                        "https://api.gavrafana.com")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });
    }

    public static async Task InitializeDatabase(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await db.Database.EnsureCreatedAsync();
    }
}