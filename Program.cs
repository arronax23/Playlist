using Microsoft.AspNetCore.Mvc;
using Playlist.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
//builder.Services.AddControllers()
//      .ConfigureApiBehaviorOptions(options =>
//      {
//          options.InvalidModelStateResponseFactory = context =>
//          {
//              var loggerFactory = context.HttpContext.RequestServices
//                .GetRequiredService<ILoggerFactory>();
//              var logger = loggerFactory.CreateLogger(context.ActionDescriptor.DisplayName);


//              return new BadRequestObjectResult(context.ModelState);
//          };
//      }); ;
builder.Services.AddSingleton<MongoDBService>();

var app = builder.Build();

app.UseHttpLogging();
app.UseHttpsRedirection();
app.MapControllers();
app.UseStaticFiles();
app.MapFallbackToFile("index.html"); ;

app.Run();
