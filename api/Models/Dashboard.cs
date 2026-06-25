namespace Api.Models;

public class Dashboard
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "New Dashboard";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<Widget> Widgets { get; set; } = new();
}

