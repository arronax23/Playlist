using Microsoft.AspNetCore.Mvc;
using Playlist.ViewModels;
using System.Diagnostics;
using YoutubeExplode;
using YoutubeExplode.Videos.Streams;

namespace Playlist.Controllers;

[ApiController]
public class YoutubeController : ControllerBase
{
    [Route("api/DownloadYoutubeVideo")]
    public async Task<IActionResult> Download(DownloadYoutubeVideoDataVM downloadData)
    {
        var downloadResult = await DownloadVideoAndAudioSeparately(downloadData.VideoLink, downloadData.VideoPath);
        
        if (downloadResult.IsSuccess == false)
            return BadRequest("Could not find separate video or audio streams.");

        var muxResult = await MuxVideoAndAudioFiles(downloadData.VideoPath, downloadResult.TmpAudioFile!, downloadResult.TmpVideoFile!);

        if (muxResult.IsSuccess == false)
            return StatusCode(500, "FFmpeg failed: " + muxResult.ErrorMessage);

        await DownloadImage(downloadData.ImgLink, downloadData.ImgPath);

        return Ok("Video and audio downloaded and muxed successfully.");
    }

    [NonAction]
    public async Task<DownloadResult> DownloadVideoAndAudioSeparately(string videoLink, string videoPath)
    {
        var youtube = new YoutubeClient();

        var streamManifest = await youtube.Videos.Streams.GetManifestAsync(videoLink);
        var videoStreamInfo = streamManifest.GetVideoOnlyStreams().GetWithHighestVideoQuality();
        var audioStreamInfo = streamManifest.GetAudioOnlyStreams().GetWithHighestBitrate();

        if (videoStreamInfo is null || audioStreamInfo is null)
            return new DownloadResult() { IsSuccess = false };

        var tempPath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "video");
        Directory.CreateDirectory(tempPath);

        var tmpVideoFile = Path.Combine(Environment.CurrentDirectory, "wwwroot", "video", "video.mp4");
        var tmpAudioFile = Path.Combine(Environment.CurrentDirectory, "wwwroot", "audio", "audio.mp4");
        var outputFile = Path.Combine(tempPath, videoPath);

        await youtube.Videos.Streams.DownloadAsync(videoStreamInfo, tmpVideoFile);
        await youtube.Videos.Streams.DownloadAsync(audioStreamInfo, tmpAudioFile);

        return new DownloadResult() { IsSuccess = true, TmpAudioFile = tmpAudioFile, TmpVideoFile = tmpVideoFile };
    }

    [NonAction]
    public async Task<MuxResult> MuxVideoAndAudioFiles(string videoPath, string tmpAudioFile, string tmpVideoFile)
    {
        var outputPath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "video");
        Directory.CreateDirectory(outputPath);
        var outputFile = Path.Combine(outputPath, videoPath);

        var ffmpegPath = Path.Combine(Environment.CurrentDirectory, "ffmpeg", "ffmpeg.exe");
        var args = $"-i \"{tmpVideoFile}\" -i \"{tmpAudioFile}\" -c copy \"{outputFile}\" -y";


        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = ffmpegPath,
                Arguments = args,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };

        process.Start();
        string standardError = await process.StandardError.ReadToEndAsync();
        await process.WaitForExitAsync();
        System.IO.File.Delete(tmpAudioFile);
        System.IO.File.Delete(tmpVideoFile);

        if (process.ExitCode != 0)
            return new MuxResult() { IsSuccess = false, ErrorMessage = standardError };
        else
            return new MuxResult() { IsSuccess = true };

    }

    [NonAction]
    public async Task DownloadImage(string url, string imgPath)
    {
        var httpClient = new HttpClient();
        var response = await httpClient.GetAsync(url);

        using (var fs = new FileStream(Path.Combine(Environment.CurrentDirectory, "wwwroot\\img", imgPath), FileMode.Create))
            await response.Content.CopyToAsync(fs);
    }


    public class DownloadResult
    {
        public bool IsSuccess { get; set; }
        public string? TmpVideoFile { get; set; }
        public string? TmpAudioFile { get; set; }
    }

    public class MuxResult
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
