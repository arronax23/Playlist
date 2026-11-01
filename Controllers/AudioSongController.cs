using Microsoft.AspNetCore.Mvc;
using Playlist.Data;
using Playlist.Models;

namespace Playlist.Controllers;

[ApiController]
[Route("api/audiosongs")]
public class AudioSongController : ControllerBase
{
    private readonly MongoDatabase _mongoDatabase;

    public AudioSongController(MongoDatabase mongoDatabase) => _mongoDatabase = mongoDatabase;

    [HttpGet]
    public IActionResult Get()
    {
        var songs = _mongoDatabase.ReadCollection<AudioSong>(AudioSong.MongoCollection);
      
        if (songs == null)
            return NotFound();

        return Ok(songs);
    }

    [HttpGet("{id}")]
    public IActionResult Get(string id)
    {
        var song = _mongoDatabase.GetOneDocument<AudioSong>(AudioSong.MongoCollection, id);

        if (song == null)
            return NotFound();

        return Ok(song);
    }

    [HttpPost]
    public IActionResult Create(
        [FromForm] string Author,
        [FromForm] string Title,
        [FromForm] IFormFile Img,
        [FromForm] IFormFile Audio)
    {
        var filesNames = UploadFiles(Img, Audio);

        var song = new AudioSong
        {
            Author = Author,
            Title = Title,
            ImgFileName = filesNames.ImgFileName,
            AudioFileName = filesNames.AudioFileName,
            CreatedDate = DateTime.Now
        };

        _mongoDatabase.Insert(AudioSong.MongoCollection, song);

        return Created($"api/GetOneSong/{song.Id}", song);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string? id)
    {
        var song = _mongoDatabase.GetOneDocument<AudioSong>(AudioSong.MongoCollection, id);
            
        _mongoDatabase.DeleteDocument<AudioSong>(AudioSong.MongoCollection, id);

        string imgAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot\\img", song.ImgFileName);
        string audioAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot\\audio", song.AudioFileName);

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

    [NonAction]
    private FilesNames UploadFiles(IFormFile img, IFormFile audio)
    {
        var imgFileName = Guid.NewGuid().ToString() + Path.GetExtension(img.FileName);
        var audioFileName = Guid.NewGuid().ToString() + Path.GetExtension(audio.FileName);

        string imgAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "img", imgFileName);
        string audioAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "audio", audioFileName);

        using (FileStream fileStream = new FileStream(imgAbsolutePath, FileMode.Create))
            img.CopyTo(fileStream);

        using (FileStream fileStream = new FileStream(audioAbsolutePath, FileMode.Create))
            audio.CopyTo(fileStream);

        return new FilesNames()
        {
            ImgFileName = imgFileName,
            AudioFileName = audioFileName
        };
    }

    private class FilesNames
    {
        public string ImgFileName { get; set; } = null!;
        public string AudioFileName { get; set; } = null!;
    }
}