using Microsoft.AspNetCore.Mvc;
using Playlist.Data;
using Playlist.Models;

namespace Playlist.Controllers;

[ApiController]
public class VideoSongController : ControllerBase
{
    private readonly MongoDatabase _mongoDatabase;

    public VideoSongController(MongoDatabase mongoDatabase)
    {
        _mongoDatabase = mongoDatabase;
    }

    [HttpGet("api/GetAllVideoSongs")]
    public IActionResult GetAllSongs()
    {
        var songs = _mongoDatabase.ReadCollection<VideoSong>(VideoSong.MongoCollection);

        if (songs== null)
            return NotFound();

        return Ok(songs);
    }

    [HttpGet("api/GetOneVideoSong/{id}")]
    public IActionResult GetOneSong(string? id)
    {
        var song = _mongoDatabase.GetOneDocument<VideoSong>(VideoSong.MongoCollection, id);

        if (song == null)
            return NotFound();

        return Ok(song);
    }

    [HttpPost("api/AddVideoSong")]
    public IActionResult AddSong(VideoSong song)
    {
        song.CreatedDate = DateTime.Now;
        _mongoDatabase.Insert(VideoSong.MongoCollection, song);

        return Created($"api/GetOneVideoSong/{song.Id}", song);
    }

    [HttpPost("api/UploadVideoFile")]
    public IActionResult UploadFile(
        [FromForm] IFormFile img,
        [FromForm] string imgPath,
        [FromForm] bool customImg,
        [FromForm] IFormFile video,
        [FromForm] string videoPath
    )
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (customImg)
        {
            string imgAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot\\img", imgPath);

            using (FileStream fileStream = new FileStream(imgAbsolutePath, FileMode.Create))
            {
                img.CopyTo(fileStream);
            }

        }

        string videoAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot\\video", videoPath);

        using (FileStream fileStream = new FileStream(videoAbsolutePath, FileMode.Create))
        {
            video.CopyTo(fileStream);
        }
        return Ok();
    }

    [HttpDelete("api/DeleteVideoSong/{id}")]
    public IActionResult DeleteSong(string? id)
    {
        var song = _mongoDatabase.GetOneDocument<VideoSong>(VideoSong.MongoCollection, id);
        
        _mongoDatabase.DeleteDocument<AudioSong>(VideoSong.MongoCollection, id);

        try
        {
            if (song.CustomImg)
            {
                string imgAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot\\img", song.ImgPath);
                System.IO.File.Delete(imgAbsolutePath);
            }

            string videoAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot\\video", song.VideoPath);
            System.IO.File.Delete(videoAbsolutePath);

        }
        catch (Exception)
        {
            return Ok("Files were not deleted");
        }

        return Ok();
    }
}
