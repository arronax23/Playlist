var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

var data = new { Author = "The Weeknd", Title = "The Hills" };

app.MapGet("/test", () => data);

app.UseStaticFiles();

app.MapFallbackToFile("index.html"); ;

app.Run();
