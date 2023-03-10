using Microsoft.AspNetCore.Mvc;
using Playlist.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<MongoDBService>();

var app = builder.Build();

app.UseHttpLogging();
app.UseHttpsRedirection();
app.MapControllers();
app.UseStaticFiles();
app.MapFallbackToFile("index.html"); ;

app.Run();
