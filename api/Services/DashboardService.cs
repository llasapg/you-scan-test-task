using Api.Data;
using Api.Models;
using Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DashboardService> _logger;

    public DashboardService(ApplicationDbContext context, ILogger<DashboardService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<Dashboard>> GetAllAsync()
    {
        return await _context.Dashboards
            .Include(d => d.Widgets.OrderBy(w => w.Position))
            .OrderBy(d => d.CreatedAt)
            .ToListAsync();
    }

    public async Task<Dashboard?> GetByIdAsync(Guid id)
    {
        return await _context.Dashboards
            .Include(d => d.Widgets.OrderBy(w => w.Position))
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<Dashboard> CreateAsync(string name)
    {
        var dashboard = new Dashboard
        {
            Id = Guid.NewGuid(),
            Name = name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Dashboards.Add(dashboard);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created dashboard {id} with name {name}", dashboard.Id, name);
        return dashboard;
    }

    public async Task<Dashboard?> UpdateAsync(Guid id, string name)
    {
        var dashboard = await _context.Dashboards.FindAsync(id);
        if (dashboard == null)
        {
            return null;
        }

        dashboard.Name = name;
        dashboard.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Updated dashboard {id} with name {name}", id, name);
        return dashboard;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var dashboard = await _context.Dashboards.FindAsync(id);
        if (dashboard == null)
        {
            return false;
        }

        _context.Dashboards.Remove(dashboard);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Deleted dashboard {id}", id);
        return true;
    }
}

