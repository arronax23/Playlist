using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver.Core.Configuration;
using Playlist.Data;
using Playlist.Models;
using Playlist.ViewModels;
using System.Data;
using System.Numerics;
using System.Reflection.PortableExecutable;
using System.Security.Cryptography;

namespace Playlist.Controllers;

[ApiController]
public class AudioSongController : ControllerBase
{
    private readonly MongoDBService _mongoDBService;
    private readonly string _collection = "song";

    public AudioSongController(MongoDBService mongoDBService)
    {
        _mongoDBService = mongoDBService;
    }

    [HttpGet("api/GetAllSongs")]
    public IActionResult GetAllSongs()
    {
        var songs = _mongoDBService.ReadCollection<AudioSong>(_collection);
      
        if (songs == null)
            return NotFound();

        return Ok(songs);
    }

    [HttpGet("api/GetOneSong/{id}")]
    public IActionResult GetOneSong(string? id)
    {
        var song = _mongoDBService.GetOneDocument<AudioSong>(_collection, id);

        if (song == null)
            return NotFound();

        return Ok(song);
    }

    [HttpPost("api/AddSong")]
    public IActionResult AddSong(AudioSong song)
    {
        song.CreatedDate = DateTime.Now;
        _mongoDBService.Insert(_collection, song);

        return Created($"api/GetOneSong/{song.Id}", song);
    }

    [HttpPost("api/UploadFile")]
    public IActionResult UploadFile(
        [FromForm] IFormFile img,
        [FromForm] IFormFile audio,
        [FromForm] string imgPath,
        [FromForm] string audioPath)
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
        var song = _mongoDBService.GetOneDocument<AudioSong>(_collection, id);
            
        _mongoDBService.DeleteDocument<AudioSong>(_collection, id);

        string imgAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot\\img", song.ImgPath);
        string audioAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot\\audio", song.AudioPath);

        try
        {
            System.IO.File.Delete(imgAbsolutePath);
            System.IO.File.Delete(audioAbsolutePath);
        }
        catch (Exception)
        {

            return Ok("Files were not deleted");
        }

        return Ok();
    }
}