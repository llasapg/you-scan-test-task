using Api.Models;
using Api.Services.Interfaces;
using Api.Validators;
using FluentValidation;

namespace Api.GraphQL;

public class Mutation
{
    public async Task<CreateDashboardPayload> CreateDashboard(
        CreateDashboardInput input,
        [Service] IDashboardService service,
        [Service] IValidator<CreateDashboardInput> validator)
    {
        var validationResult = await validator.ValidateAsync(input);
        if (!validationResult.IsValid)
        {
            return new CreateDashboardPayload(null, validationResult.Errors.First().ErrorMessage);
        }

        try
        {
            var dashboard = await service.CreateAsync(input.Name);
            return new CreateDashboardPayload(dashboard, null);
        }
        catch (Exception ex)
        {
            return new CreateDashboardPayload(null, ex.Message);
        }
    }

    public async Task<UpdateDashboardPayload> UpdateDashboard(
        UpdateDashboardInput input,
        [Service] IDashboardService service,
        [Service] IValidator<UpdateDashboardInput> validator)
    {
        var validationResult = await validator.ValidateAsync(input);
        if (!validationResult.IsValid)
        {
            return new UpdateDashboardPayload(null, validationResult.Errors.First().ErrorMessage);
        }

        try
        {
            var dashboard = await service.UpdateAsync(input.Id, input.Name);
            if (dashboard == null)
            {
                return new UpdateDashboardPayload(null, "Dashboard not found");
            }

            return new UpdateDashboardPayload(dashboard, null);
        }
        catch (Exception ex)
        {
            return new UpdateDashboardPayload(null, ex.Message);
        }
    }

    public async Task<DeleteDashboardPayload> DeleteDashboard(
        DeleteDashboardInput input,
        [Service] IDashboardService service,
        [Service] IValidator<DeleteDashboardInput> validator)
    {
        var validationResult = await validator.ValidateAsync(input);
        if (!validationResult.IsValid)
        {
            return new DeleteDashboardPayload(false, validationResult.Errors.First().ErrorMessage);
        }

        try
        {
            var success = await service.DeleteAsync(input.Id);
            if (!success)
            {
                return new DeleteDashboardPayload(false, "Dashboard not found");
            }

            return new DeleteDashboardPayload(true, null);
        }
        catch (Exception ex)
        {
            return new DeleteDashboardPayload(false, ex.Message);
        }
    }

    public async Task<CreateWidgetPayload> CreateWidget(
        CreateWidgetInput input,
        [Service] IWidgetService service,
        [Service] IValidator<CreateWidgetInput> validator)
    {
        var validationResult = await validator.ValidateAsync(input);
        if (!validationResult.IsValid)
        {
            return new CreateWidgetPayload(null, validationResult.Errors.First().ErrorMessage);
        }

        try
        {
            var widget = await service.CreateAsync(input.DashboardId, input.Type, input.Data);
            return new CreateWidgetPayload(widget, null);
        }
        catch (Exception ex)
        {
            return new CreateWidgetPayload(null, ex.Message);
        }
    }

    public async Task<UpdateWidgetPayload> UpdateWidget(
        UpdateWidgetInput input,
        [Service] IWidgetService service,
        [Service] IValidator<UpdateWidgetInput> validator)
    {
        var validationResult = await validator.ValidateAsync(input);
        if (!validationResult.IsValid)
        {
            return new UpdateWidgetPayload(null, validationResult.Errors.First().ErrorMessage);
        }

        try
        {
            var widget = await service.UpdateAsync(input.Id, input.Data);
            if (widget == null)
            {
                return new UpdateWidgetPayload(null, "Widget not found");
            }

            return new UpdateWidgetPayload(widget, null);
        }
        catch (Exception ex)
        {
            return new UpdateWidgetPayload(null, ex.Message);
        }
    }

    public async Task<DeleteWidgetPayload> DeleteWidget(
        DeleteWidgetInput input,
        [Service] IWidgetService service,
        [Service] IValidator<DeleteWidgetInput> validator)
    {
        var validationResult = await validator.ValidateAsync(input);
        if (!validationResult.IsValid)
        {
            return new DeleteWidgetPayload(false, validationResult.Errors.First().ErrorMessage);
        }

        try
        {
            var success = await service.DeleteAsync(input.Id);
            if (!success)
            {
                return new DeleteWidgetPayload(false, "Widget not found");
            }

            return new DeleteWidgetPayload(true, null);
        }
        catch (Exception ex)
        {
            return new DeleteWidgetPayload(false, ex.Message);
        }
    }
}

public record CreateDashboardPayload(Dashboard? Dashboard, string? Error);
public record UpdateDashboardPayload(Dashboard? Dashboard, string? Error);
public record DeleteDashboardPayload(bool Success, string? Error);

public record CreateWidgetPayload(Widget? Widget, string? Error);
public record UpdateWidgetPayload(Widget? Widget, string? Error);
public record DeleteWidgetPayload(bool Success, string? Error);