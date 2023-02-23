﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Playlist.Data;
using Playlist.Models;

namespace Playlist.Controllers;

[ApiController]
public class VideoSongController : ControllerBase
{
    private readonly MongoDBService _mongoDBService;
    private readonly string _database = "playlist";
    private readonly string _collection = "videoSong";

    public VideoSongController(MongoDBService mongoDBService)
    {
        _mongoDBService = mongoDBService;
    }

    [HttpGet("api/GetAllVideoSongs")]
    public IEnumerable<VideoSong> GetAllSongs()
    {
        return _mongoDBService.ReadCollection<VideoSong>(_database, _collection);
    }

    [HttpGet("api/GetOneVideoSong/{id}")]
    public VideoSong GetOneSong(string? id)
    {
        return _mongoDBService.GetOneDocument<VideoSong>(_database, _collection, id);
    }

    [HttpPost("api/AddVideoSong")]
    public IActionResult AddSong(VideoSong song)
    {
        _mongoDBService.Insert(_database, _collection, song);
        return Ok();
    }

    [HttpPost("api/UploadVideoFile")]
    public IActionResult UploadFile([FromForm] IFormFile img, [FromForm] string imgPath, [FromForm] bool customImg, [FromForm] IFormFile video, [FromForm] string videoPath)
    {

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (customImg)
        {
            string imgAbsolutePath = Path.Combine(Environment.CurrentDirectory, "ClientApp\\public\\img", imgPath);

            using (FileStream fileStream = new FileStream(imgAbsolutePath, FileMode.Create))
            {
                img.CopyTo(fileStream);
            }

        }

        string videoAbsolutePath = Path.Combine(Environment.CurrentDirectory, "ClientApp\\public\\video", videoPath);

        using (FileStream fileStream = new FileStream(videoAbsolutePath, FileMode.Create))
        {
            video.CopyTo(fileStream);
        }
        return Ok();
    }

    [HttpDelete("api/DeleteVideoSong/{id}")]
    public IActionResult DeleteSong(string? id)
    {
        var song = _mongoDBService.GetOneDocument<VideoSong>(_database, _collection, id);

        if (song.CustomImg)
        {
            string imgAbsolutePath = Path.Combine(Environment.CurrentDirectory, "ClientApp\\public\\img", song.ImgPath);
            System.IO.File.Delete(imgAbsolutePath);
        }

        string videoAbsolutePath = Path.Combine(Environment.CurrentDirectory, "ClientApp\\public\\video", song.VideoPath);
        System.IO.File.Delete(videoAbsolutePath);

        _mongoDBService.DeleteDocument<Song>(_database, _collection, id);

        return Ok();
    }
}