using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Playlist.Data;
using Playlist.Models;
using Playlist.ViewModels;

namespace Playlist.Controllers
{
    [ApiController]
    public class SongController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;
        private readonly string _audioSongcollection = "song";
        private readonly string _videoSongcollection = "videoSong";

        public SongController(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
        }

        [HttpGet("api/GetAudioAndVideoSongsForPage/{currentPage}/{songsPerPage}")]
        public IEnumerable<SongVM> GetAudioAndVideoSongsPerPage(int currentPage, int songsPerPage)
        {
            var audioSongs =  _mongoDBService.ReadCollection<AudioSong>(_audioSongcollection);
            var videoSongs =  _mongoDBService.ReadCollection<VideoSong>(_videoSongcollection);

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

            var audioSongs = _mongoDBService.ReadCollection<AudioSong>(_audioSongcollection);
            var videoSongs = _mongoDBService.ReadCollection<VideoSong>(_videoSongcollection);

            int totalCount = audioSongs.Count() + videoSongs.Count();

            return totalCount;
        }
    }
}
