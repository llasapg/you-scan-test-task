using Api.Models;
using Api.Services.Interfaces;

namespace Api.GraphQL;

public class Query
{
    public async Task<List<Dashboard>> GetDashboards([Service] IDashboardService service)
    {
        return await service.GetAllAsync();
    }

    public async Task<Dashboard?> GetDashboard(
        Guid id,
        [Service] IDashboardService service)
    {
        return await service.GetByIdAsync(id);
    }

    public async Task<List<Widget>> GetWidgets(
        Guid dashboardId,
        [Service] IWidgetService service)
    {
        return await service.GetAllAsync(dashboardId);
    }

    public async Task<Widget?> GetWidget(
        Guid id,
        [Service] IWidgetService service)
    {
        return await service.GetByIdAsync(id);
    }
}

