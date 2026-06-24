using Api.Models;
using FluentValidation;

namespace Api.Validators;

public class CreateWidgetInputValidator : AbstractValidator<CreateWidgetInput>
{
    public CreateWidgetInputValidator()
    {
        RuleFor(x => x.Type)
            .IsInEnum()
            .WithMessage("Invalid widget type");

        RuleFor(x => x.Data)
            .MaximumLength(5000)
            .When(x => x.Data != null)
            .WithMessage("Data cannot exceed 5000 characters");
    }
}

public class UpdateWidgetInputValidator : AbstractValidator<UpdateWidgetInput>
{
    public UpdateWidgetInputValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Widget ID is required");

        RuleFor(x => x.Data)
            .MaximumLength(5000)
            .When(x => x.Data != null)
            .WithMessage("Data cannot exceed 5000 characters");
    }
}

public class DeleteWidgetInputValidator : AbstractValidator<DeleteWidgetInput>
{
    public DeleteWidgetInputValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Widget ID is required");
    }
}

public record CreateWidgetInput(WidgetType Type, string? Data);
public record UpdateWidgetInput(Guid Id, string? Data);
public record DeleteWidgetInput(Guid Id);

