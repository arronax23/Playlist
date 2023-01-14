using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Playlist.Data;
using Playlist.Models;
using System.Data;
using System.Numerics;

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

        [HttpGet("api/GetOneSong")]
        public Song GetOneSong(string _id)
        {
            return _mongoDBService.GetOneDocument<Song>("playlist", "song", new MongoDB.Bson.ObjectId(_id));
        }

        [HttpPost("api/AddSong")]
        public IActionResult AddSong(Song song)
        {
            _mongoDBService.Insert("playlist", "song", song);
            return Ok();
        }

        [HttpPost("api/UploadFile")]
        public IActionResult UploadFile([FromForm] IFormFile img, [FromForm] IFormFile audio)
        {
            string imgPath = Path.Combine(Environment.CurrentDirectory,"ClientApp\\public\\img", img.FileName);
            string audioPath = Path.Combine(Environment.CurrentDirectory, "ClientApp\\public\\audio", audio.FileName);

            using (FileStream fileStream = new FileStream(imgPath, FileMode.Create))
            {
                img.CopyTo(fileStream);
            }

            using (FileStream fileStream = new FileStream(audioPath, FileMode.Create))
            {
                audio.CopyTo(fileStream);
            }
            return Ok();
        }
    }
}
