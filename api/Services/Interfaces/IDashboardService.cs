using Api.Models;

namespace Api.Services.Interfaces;

public interface IDashboardService
{
    Task<List<Dashboard>> GetAllAsync();
    Task<Dashboard?> GetByIdAsync(Guid id);
    Task<Dashboard> CreateAsync(string name);
    Task<Dashboard?> UpdateAsync(Guid id, string name);
    Task<bool> DeleteAsync(Guid id);
}

