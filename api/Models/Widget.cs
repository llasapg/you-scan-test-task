namespace Api.Models;

public class Widget
{
    public Guid Id { get; set; }
    public Guid DashboardId { get; set; }
    public WidgetType Type { get; set; }
    public int Position { get; set; }
    public string? Data { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Dashboard? Dashboard { get; set; }
}

