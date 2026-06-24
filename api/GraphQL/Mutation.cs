using Api.Models;
using Api.Services.Interfaces;
using Api.Validators;
using FluentValidation;

namespace Api.GraphQL;

public class Mutation
{
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
            var widget = await service.CreateAsync(input.Type, input.Data);
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

public record CreateWidgetPayload(Widget? Widget, string? Error);

public record UpdateWidgetPayload(Widget? Widget, string? Error);

public record DeleteWidgetPayload(bool Success, string? Error);