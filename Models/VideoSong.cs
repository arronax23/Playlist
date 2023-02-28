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
    public string Author { get; set; } = null!;
    [Required]
    public string Title { get; set; } = null!;
    public bool CustomImg { get; set; }
    public string ImgPath { get; set; } = null!;
    public string VideoPath { get; set; } = null!;

}
