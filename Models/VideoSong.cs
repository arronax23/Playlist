using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Playlist.Models.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Playlist.Models;

public class VideoSong : IDocument
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    [Required]
    [StringLength(30)]
    public string Author { get; set; } = null!;
    [Required]
    [StringLength(30)]
    public string Title { get; set; } = null!;
    public bool CustomImg { get; set; }
    public string ImgFileName { get; set; } = null!;
    public string VideoFileName { get; set; } = null!;
    public DateTime CreatedDate { get; set; }

    [BsonIgnore]
    public static string MongoCollection => "videoSongs";
}
