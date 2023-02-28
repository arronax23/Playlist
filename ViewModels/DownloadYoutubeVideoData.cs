using System.ComponentModel.DataAnnotations;

namespace Playlist.ViewModels;

public class DownloadYoutubeVideoData
{
    [Required]
    public string VideoPath { get; set; } = null!;
    [Required]
    public string VideoLink { get; set; } = null!;
    [Required]
    public string ImgPath { get; set; } = null!;
    [Required]
    public string ImgLink { get; set; } = null!;
}
