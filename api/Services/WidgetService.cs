using Api.Data;
using Api.Models;
using Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class WidgetService(ApplicationDbContext context) : IWidgetService
{
    public async Task<List<Widget>> GetAllAsync(Guid dashboardId)
    {
        return await context.Widgets
            .Where(w => w.DashboardId == dashboardId)
            .OrderBy(w => w.Position)
            .ToListAsync();
    }

    public async Task<Widget?> GetByIdAsync(Guid id)
    {
        return await context.Widgets.FindAsync(id);
    }

    public async Task<Widget> CreateAsync(Guid dashboardId, WidgetType type, string? data)
    {
        var position = await context.Widgets
            .Where(w => w.DashboardId == dashboardId)
            .CountAsync();
        
        var widget = new Widget
        {
            Id = Guid.NewGuid(),
            DashboardId = dashboardId,
            Type = type,
            Position = position,
            Data = data,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Widgets.Add(widget);
        await context.SaveChangesAsync();

        return widget;
    }

    public async Task<Widget?> UpdateAsync(Guid id, string? data)
    {
        var widget = await context.Widgets.FindAsync(id);
        if (widget == null)
            return null;

        widget.Data = data;
        widget.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        return widget;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var widget = await context.Widgets.FindAsync(id);
        if (widget == null)
            return false;

        var dashboardId = widget.DashboardId;
        context.Widgets.Remove(widget);
        await context.SaveChangesAsync();

        await ReorderPositionsAsync(dashboardId);

        return true;
    }

    private async Task ReorderPositionsAsync(Guid dashboardId)
    {
        var widgets = await context.Widgets
            .Where(w => w.DashboardId == dashboardId)
            .OrderBy(w => w.Position)
            .ToListAsync();

        for (int i = 0; i < widgets.Count; i++)
        {
            widgets[i].Position = i;
        }

        await context.SaveChangesAsync();
    }
}

