using Playlist.Endpoints;

var builder = WebApplication.CreateBuilder(args);
builder.Services.DefineServices();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "corsPolicy",
                      policy =>
                          policy
                          .AllowAnyOrigin()
                          .AllowAnyHeader());
});

var app = builder.Build();
app.DefineEndpoints();

var data = new { Author = "The Weeknd", Title = "The Hills" };
app.MapGet("/test", () => data);

app.UseCors("corsPolicy");
app.UseHttpsRedirection();
app.MapControllers();
app.UseStaticFiles();
app.MapFallbackToFile("index.html"); ;

app.Run();
