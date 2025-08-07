using Microsoft.AspNetCore.Mvc;
using Playlist.Data;
using Playlist.Models;
using Playlist.ViewModels;

namespace Playlist.Controllers
{
    [ApiController]
    public class SongController : ControllerBase
    {
        private readonly MongoDatabase _mongoDatabase;
        
        public SongController(MongoDatabase mongoDatabase)
        {
            _mongoDatabase = mongoDatabase;
        }

        [HttpGet("api/GetAudioAndVideoSongsForPage/{currentPage}/{songsPerPage}")]
        public IEnumerable<SongVM> GetAudioAndVideoSongsPerPage(int currentPage, int songsPerPage)
        {
            var audioSongs =  _mongoDatabase.ReadCollection<AudioSong>(AudioSong.MongoCollection);
            var videoSongs =  _mongoDatabase.ReadCollection<VideoSong>(VideoSong.MongoCollection);

            List<SongVM> songs = new List<SongVM>();
            songs.AddRange(audioSongs.Select(audioSong => new SongVM()
            {
                Id= audioSong.Id,
                Type = SongType.Audio,
                Author= audioSong.Author,
                Title= audioSong.Title,
                ImgPath= audioSong.ImgPath,
                AudioPath= audioSong.AudioPath,
                CreatedDate= audioSong.CreatedDate
            }));

            songs.AddRange(videoSongs.Select(videoSong => new SongVM()
            {
                Id = videoSong.Id,
                Type = SongType.Video,
                Author = videoSong.Author,
                Title = videoSong.Title,
                CustomImg = videoSong.CustomImg,
                ImgPath = videoSong.ImgPath,
                VideoPath = videoSong.VideoPath,
                CreatedDate = videoSong.CreatedDate
            }));

            songs = songs
                .OrderBy(s => s.CreatedDate)
                .Skip((currentPage - 1) * songsPerPage)
                .Take(songsPerPage)
                .ToList();

            return songs;

        }

        [HttpGet("api/GetSongsTotalCount")]
        public int GetSongsTotalCount()
        {
            var audioSongs = _mongoDatabase.ReadCollection<AudioSong>(AudioSong.MongoCollection);
            var videoSongs = _mongoDatabase.ReadCollection<VideoSong>(VideoSong.MongoCollection);

            int totalCount = audioSongs.Count() + videoSongs.Count();

            return totalCount;
        }
    }
}
