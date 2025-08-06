using Microsoft.AspNetCore.Mvc;
using Playlist.Data;
using Playlist.Models;

namespace Playlist.Controllers;

[ApiController]
public class AudioSongController : ControllerBase
{
    private readonly MongoDatabase _mongoDatabase;

    public AudioSongController(MongoDatabase mongoDatabase)
    {
        _mongoDatabase = mongoDatabase;
    }

    [HttpGet("api/GetAllSongs")]
    public IActionResult GetAllSongs()
    {
        var songs = _mongoDatabase.ReadCollection<AudioSong>(AudioSong.MongoCollection);
      
        if (songs == null)
            return NotFound();

        return Ok(songs);
    }

    [HttpGet("api/GetOneSong/{id}")]
    public IActionResult GetOneSong(string? id)
    {
        var song = _mongoDatabase.GetOneDocument<AudioSong>(AudioSong.MongoCollection, id);

        if (song == null)
            return NotFound();

        return Ok(song);
    }

    [HttpPost("api/AddSong")]
    public IActionResult AddSong(AudioSong song)
    {
        song.CreatedDate = DateTime.Now;
        _mongoDatabase.Insert(AudioSong.MongoCollection, song);

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
        var song = _mongoDatabase.GetOneDocument<AudioSong>(AudioSong.MongoCollection, id);
            
        _mongoDatabase.DeleteDocument<AudioSong>(AudioSong.MongoCollection, id);

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