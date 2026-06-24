using Api.Models;
using Api.Services.Interfaces;

namespace Api.GraphQL;

public class Query
{
    public async Task<List<Widget>> GetWidgets([Service] IWidgetService service)
    {
        return await service.GetAllAsync();
    }

    public async Task<Widget?> GetWidget(
        Guid id,
        [Service] IWidgetService service,
        [Service] ILogger<Query> logger)
    {
        logger.LogInformation("Getting widget {id}", id);
        
        return await service.GetByIdAsync(id);
    }
}