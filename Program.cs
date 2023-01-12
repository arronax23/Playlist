using Playlist.Endpoints;

var builder = WebApplication.CreateBuilder(args);
builder.Services.DefineServices();

var app = builder.Build();
app.DefineEndpoints();

var data = new { Author = "The Weeknd", Title = "The Hills" };
app.MapGet("/test", () => data);

app.UseStaticFiles();
app.MapFallbackToFile("index.html"); ;

app.Run();
