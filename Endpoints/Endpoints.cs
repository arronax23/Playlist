using Playlist.Data;
using Playlist.Models;

namespace Playlist.Endpoints;

public static class Endpoints
{
    public static void DefineEndpoints(this WebApplication app)
    {
        app.MapGet("/api/GetAllSongs", GetAllSongs);
        app.MapGet("/api/GetOneSong", GetOneSong);
        app.MapPost("/api/AddSong", AddSong);
    }

    public static void DefineServices(this IServiceCollection services)
    {
        services.AddSingleton<MongoDBService>();
    }

    private static IEnumerable<Song> GetAllSongs(MongoDBService mongoDBService)
    {
        return mongoDBService.ReadCollection<Song>("playlist", "song");
    }

    private static Song GetOneSong(string _id, MongoDBService mongoDBService)
    {
        return mongoDBService.GetOneDocument<Song>("playlist", "song", new MongoDB.Bson.ObjectId(_id));
    }
    private static IResult AddSong(Song song, MongoDBService mongoDBService)
    {
        mongoDBService.Insert("playlist", "song", song);
        return Results.Ok();
    }

}
