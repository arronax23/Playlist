using Microsoft.AspNetCore.Mvc;
using Playlist.Data;
using Playlist.Models;

namespace Playlist.Controllers;

[ApiController]
[Route("api/videosongs")]
public class VideoSongController : ControllerBase
{
    private readonly MongoDatabase _mongoDatabase;

    public VideoSongController(MongoDatabase mongoDatabase) => _mongoDatabase = mongoDatabase;

    [HttpGet]
    public IActionResult Get()
    {
        var songs = _mongoDatabase.ReadCollection<VideoSong>(VideoSong.MongoCollection);

        if (songs== null)
            return NotFound();

        return Ok(songs);
    }

    [HttpGet("{id}")]
    public IActionResult Get(string id)
    {
        var song = _mongoDatabase.GetOneDocument<VideoSong>(VideoSong.MongoCollection, id);

        if (song == null)
            return NotFound();

        return Ok(song);
    }

    [HttpPost]
    public IActionResult Create(
        [FromForm] string Author,
        [FromForm] string Title,
        [FromForm] bool CustomImg,
        [FromForm] IFormFile Img,
        [FromForm] IFormFile Video)
    {
        var filesNames = UploadFiles(Img, Video, CustomImg);

        var song = new VideoSong
        {
            Author = Author,
            Title = Title,
            ImgFileName = filesNames.ImgFileName,
            CustomImg = CustomImg,
            VideoFileName = filesNames.VideoFileName,
            CreatedDate = DateTime.Now
        };

        _mongoDatabase.Insert(VideoSong.MongoCollection, song);

         return Created($"api/GetOneVideoSong/{song.Id}", song);

    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string? id)
    {
        var song = _mongoDatabase.GetOneDocument<VideoSong>(VideoSong.MongoCollection, id);
        
        _mongoDatabase.DeleteDocument<VideoSong>(VideoSong.MongoCollection, id);

        try
        {
            if (song.CustomImg)
            {
                string imgAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "img", song.ImgFileName);
                System.IO.File.Delete(imgAbsolutePath);
            }

            string videoAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "video", song.VideoFileName);
            System.IO.File.Delete(videoAbsolutePath);

        }
        catch (Exception)
        {
            return Ok("Files were not deleted");
        }

        return Ok();
    }

    [NonAction]
    private FilesNames UploadFiles(IFormFile img, IFormFile video, bool customImg)
    {
        var imgFileName = Guid.NewGuid().ToString() + Path.GetExtension(img.FileName);
        var videoFileName = Guid.NewGuid().ToString() + Path.GetExtension(video.FileName);

        if (customImg)
        {
            string imgAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "img", imgFileName);

            using (FileStream fileStream = new FileStream(imgAbsolutePath, FileMode.Create))
                img.CopyTo(fileStream);
        }

        string videoAbsolutePath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "video", videoFileName);

        using (FileStream fileStream = new FileStream(videoAbsolutePath, FileMode.Create))
            video.CopyTo(fileStream);

        return new FilesNames()
        {
            ImgFileName = imgFileName,
            VideoFileName = videoFileName
        };
    }
    private class FilesNames
    {
        public string ImgFileName { get; set; } = null!;
        public string VideoFileName { get; set; } = null!;
    }
}
