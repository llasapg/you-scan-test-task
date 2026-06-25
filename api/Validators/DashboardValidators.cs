using Api.Models;
using FluentValidation;

namespace Api.Validators;

public class CreateDashboardInput
{
    public string Name { get; set; } = "New Dashboard";
}

public class UpdateDashboardInput
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class DeleteDashboardInput
{
    public Guid Id { get; set; }
}

public class CreateDashboardInputValidator : AbstractValidator<CreateDashboardInput>
{
    public CreateDashboardInputValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Dashboard name is required")
            .MaximumLength(200).WithMessage("Dashboard name must not exceed 200 characters");
    }
}

public class UpdateDashboardInputValidator : AbstractValidator<UpdateDashboardInput>
{
    public UpdateDashboardInputValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Dashboard ID is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Dashboard name is required")
            .MaximumLength(200).WithMessage("Dashboard name must not exceed 200 characters");
    }
}

public class DeleteDashboardInputValidator : AbstractValidator<DeleteDashboardInput>
{
    public DeleteDashboardInputValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Dashboard ID is required");
    }
}

