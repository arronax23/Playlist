using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Playlist.Models;
using Playlist.ViewModels;
using System;
using YoutubeExplode;
using YoutubeExplode.Videos.Streams;
using static System.Net.WebRequestMethods;

namespace Playlist.Controllers;

[ApiController]
public class YoutubeController : ControllerBase
{
    [NonAction]
    public async Task DownloadImage(string url, string imgPath)
    {
        var httpClient = new HttpClient();
        var response = await httpClient.GetAsync(url);

        using (var fs = new FileStream(Path.Combine(Environment.CurrentDirectory, "wwwroot\\img", imgPath), FileMode.Create))
        {
            await response.Content.CopyToAsync(fs);
        }
    }

    [Route("api/DownloadYoutubeVideo")]
    public async Task<IActionResult> Download(DownloadYoutubeVideoData downloadData)
    {
        string filePath = Path.Combine(Environment.CurrentDirectory, "wwwroot\\video", downloadData.VideoPath);
        var youtube = new YoutubeClient();

        var streamManifest = await youtube.Videos.Streams.GetManifestAsync(downloadData.VideoLink);
        IVideoStreamInfo? streamInfo = streamManifest.GetMuxedStreams().SingleOrDefault(s => s.VideoQuality.Label == "360p");
        streamInfo ??= streamManifest.GetMuxedStreams().GetWithHighestVideoQuality();

        await youtube.Videos.Streams.DownloadAsync(streamInfo, filePath);

        await DownloadImage(downloadData.ImgLink, downloadData.ImgPath);

        return Ok("Youtube video downloaded");
    }
}
