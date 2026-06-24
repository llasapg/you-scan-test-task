using Api.Models;

namespace Api.Services.Interfaces;

public interface IWidgetService
{
    Task<List<Widget>> GetAllAsync();
    Task<Widget?> GetByIdAsync(Guid id);
    Task<Widget> CreateAsync(WidgetType type, string? data);
    Task<Widget?> UpdateAsync(Guid id, string? data);
    Task<bool> DeleteAsync(Guid id);
}

