using Api.Models;

namespace Api.Services.Interfaces;

public interface IWidgetService
{
    Task<List<Widget>> GetAllAsync(Guid dashboardId);
    Task<Widget?> GetByIdAsync(Guid id);
    Task<Widget> CreateAsync(Guid dashboardId, WidgetType type, string? data);
    Task<Widget?> UpdateAsync(Guid id, string? data);
    Task<bool> DeleteAsync(Guid id);
}

