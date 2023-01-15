using Microsoft.AspNetCore.Mvc;
using Playlist.Data;
using Playlist.Models;
using System.Text;

namespace Playlist.Endpoints;

public static class Endpoints
{
    public static void DefineEndpoints(this WebApplication app)
    {
        app.MapGet("/api/GetAllSongs", GetAllSongs);
        //app.MapGet("/api/GetOneSong", GetOneSong);
        app.MapPost("/api/AddSong", AddSong);
        //app.MapPost("/api/UploadFile", UploadFile).Accepts<IFormFile>("text/plain", new[] { "image/webp", "image/img" } );
    }
    public static void DefineServices(this IServiceCollection services)
    {
        services.AddSingleton<MongoDBService>();
    }

    private static IEnumerable<Song> GetAllSongs(MongoDBService mongoDBService)
    {
        return mongoDBService.ReadCollection<Song>("playlist", "song");
    }

    //private static Song GetOneSong(string _id, MongoDBService mongoDBService)
    //{
    //    return mongoDBService.GetOneDocument<Song>("playlist", "song", new MongoDB.Bson.ObjectId(_id));
    //}
    private static IResult AddSong(Song song, MongoDBService mongoDBService)
    {
        mongoDBService.Insert("playlist", "song", song);
        return Results.Ok();
    }

    //private static async Task<IResult> UploadFile(HttpRequest request)
    //{
    //    var files = request.Form.Files;
    //    var file = request.Form.Files[0];
    //    //using (var reader = new StreamReader(request.Body, System.Text.Encoding.UTF8))
    //    //{

    //    //    string fileContent = await reader.ReadToEndAsync();
    //    //    File.WriteAllText("./detect.webp", fileContent, Encoding.UTF8);

    //    //    string b = "aa";
    //    //}

    //    return Results.Ok();
    //}


}
