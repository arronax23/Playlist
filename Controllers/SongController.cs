using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using Playlist.Data;
using Playlist.Models;
using System.Data;
using System.Numerics;
using System.Reflection.PortableExecutable;
using System.Security.Cryptography;

namespace Playlist.Controllers;

[ApiController]
public class SongController : ControllerBase
{
    private readonly MongoDBService _mongoDBService;
    private readonly string _database = "playlist";
    private readonly string _collection = "song";

    public SongController(MongoDBService mongoDBService)
    {
        _mongoDBService = mongoDBService;
    }

    [HttpGet("api/GetAllSongs")]
    public IEnumerable<Song> GetAllSongs()
    {
        return _mongoDBService.ReadCollection<Song>(_database, _collection);
    }

    [HttpGet("api/GetOneSong/{id}")]
    public Song GetOneSong(string? id)
    {
        return _mongoDBService.GetOneDocument<Song>(_database, _collection, id);
    }

    [HttpPost("api/AddSong")]
    public IActionResult AddSong(Song song)
    {
        _mongoDBService.Insert(_database, _collection, song);

        return Created($"api/GetOneVideoSong/{song.Id}", song);
    }

    [HttpPost("api/UploadFile")]
    public IActionResult UploadFile([FromForm] IFormFile img, [FromForm] IFormFile audio, [FromForm] string imgPath, [FromForm] string audioPath)
    {
        string imgAbsolutePath = Path.Combine(Environment.CurrentDirectory,"wwwroot\\img", imgPath);
        string audioAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot\\audio", audioPath);

        using (FileStream fileStream = new FileStream(imgAbsolutePath, FileMode.Create))
        {
            img.CopyTo(fileStream);
        }

        using (FileStream fileStream = new FileStream(audioAbsolutePath, FileMode.Create))
        {
            audio.CopyTo(fileStream);
        }
        return Ok();
    }

    [HttpDelete("api/DeleteSong/{id}")]
    public IActionResult DeleteSong(string? id)
    {
        var song = _mongoDBService.GetOneDocument<Song>(_database, _collection, id);

        string imgAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot\\img", song.ImgPath);
        string audioAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot\\audio", song.AudioPath);

        System.IO.File.Delete(imgAbsolutePath);
        System.IO.File.Delete(audioAbsolutePath);

        _mongoDBService.DeleteDocument<Song>(_database, _collection, id);
        return Ok();
    }
}
