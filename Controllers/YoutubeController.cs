using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Playlist.Models;
using Playlist.ViewModels;
using YoutubeExplode;
using YoutubeExplode.Videos.Streams;
using static System.Net.WebRequestMethods;

namespace Playlist.Controllers;

[ApiController]
public class YoutubeController : ControllerBase
{

    [Route("api/DownloadYoutubeVideo")]
    public async Task<IActionResult> Download(DownloadYoutubeVideoData downloadData)
    {
        string filePath = Path.Combine(Environment.CurrentDirectory, "ClientApp\\public\\video", downloadData.VideoPath);
        var youtube = new YoutubeClient();

        var streamManifest = await youtube.Videos.Streams.GetManifestAsync(downloadData.Link);


        IVideoStreamInfo? streamInfo = streamManifest.GetMuxedStreams().SingleOrDefault(s => s.VideoQuality.Label == "144p");

        streamInfo ??= streamManifest.GetMuxedStreams().GetWithHighestVideoQuality();


        await youtube.Videos.Streams.DownloadAsync(streamInfo, filePath);
        return Ok("Youtube video downloaded");
    }
}
