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

namespace Playlist.Controllers
{
    [ApiController]
    public class SongController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;

        public SongController(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
        }

        [HttpGet("api/GetAllSongs")]
        public IEnumerable<Song> GetAllSongs()
        {
            return _mongoDBService.ReadCollection<Song>("playlist", "song");
        }

        [HttpGet("api/GetOneSong/{id}")]
        public Song GetOneSong(string? id)
        {
            return _mongoDBService.GetOneDocument<Song>("playlist", "song", id);
        }

        [HttpPost("api/AddSong")]
        public IActionResult AddSong(Song song)
        {
            _mongoDBService.Insert("playlist", "song", song);
            return Ok();
        }

        [HttpPost("api/UploadFile")]
        public IActionResult UploadFile([FromForm] IFormFile img, [FromForm] IFormFile audio, [FromForm] string imgPath, [FromForm] string audioPath)
        {
            string imgAbsolutePath = Path.Combine(Environment.CurrentDirectory,"ClientApp\\public\\img", imgPath);
            string audioABsolutePath = Path.Combine(Environment.CurrentDirectory, "ClientApp\\public\\audio", audioPath);

            using (FileStream fileStream = new FileStream(imgAbsolutePath, FileMode.Create))
            {
                img.CopyTo(fileStream);
            }

            using (FileStream fileStream = new FileStream(audioABsolutePath, FileMode.Create))
            {
                audio.CopyTo(fileStream);
            }
            return Ok();
        }
    }
}
