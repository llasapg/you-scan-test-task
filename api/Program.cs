using api.Configurations;

var builder = WebApplication.CreateBuilder(args);

builder.ConfigureDb();
builder.RegisterServices();
builder.AddCustomGraphQl();
builder.ConfigureCors();

var app = builder.Build();

app.UseCors();
app.MapGraphQL();
await app.InitializeDatabase();
await app.RunAsync();