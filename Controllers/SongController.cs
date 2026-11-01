using Microsoft.AspNetCore.Mvc;
using Playlist.Data;
using Playlist.Models;
using Playlist.ViewModels;

namespace Playlist.Controllers
{
    [ApiController]
    [Route("api/songs")]
    public class SongController : ControllerBase
    {
        private readonly MongoDatabase _mongoDatabase;
        
        public SongController(MongoDatabase mongoDatabase) => _mongoDatabase = mongoDatabase;

        [HttpGet]
        public IEnumerable<SongVM> GetAudioAndVideoSongsPerPage(int pageNumber = 1, int pageSize = 10)
        {
            var audioSongs =  _mongoDatabase.ReadCollection<AudioSong>(AudioSong.MongoCollection);
            var videoSongs =  _mongoDatabase.ReadCollection<VideoSong>(VideoSong.MongoCollection);

            List<SongVM> songs = new List<SongVM>();
            songs.AddRange(audioSongs.Select(audioSong => new SongVM()
            {
                Id = audioSong.Id,
                Type = SongType.Audio,
                Author = audioSong.Author,
                Title = audioSong.Title,
                ImgFileName = audioSong.ImgFileName,
                AudioFileName = audioSong.AudioFileName,
                CreatedDate = audioSong.CreatedDate
            }));

            songs.AddRange(videoSongs.Select(videoSong => new SongVM()
            {
                Id = videoSong.Id,
                Type = SongType.Video,
                Author = videoSong.Author,
                Title = videoSong.Title,
                CustomImg = videoSong.CustomImg,
                ImgFileName = videoSong.ImgFileName,
                VideoFileName = videoSong.VideoFileName,
                CreatedDate = videoSong.CreatedDate
            }));

            songs = songs
                .OrderBy(s => s.CreatedDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return songs;
        }

        [HttpGet("count")]
        public int GetSongsTotalCount()
        {
            var audioSongs = _mongoDatabase.ReadCollection<AudioSong>(AudioSong.MongoCollection);
            var videoSongs = _mongoDatabase.ReadCollection<VideoSong>(VideoSong.MongoCollection);

            int totalCount = audioSongs.Count() + videoSongs.Count();

            return totalCount;
        }
    }
}
