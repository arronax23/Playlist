using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Playlist.Models.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Playlist.Models;

public class AudioSong : IDocument
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
    public string ImgFileName { get; set; } = null!;
    public string AudioFileName { get; set; } = null!;
    public DateTime CreatedDate { get; set; }

    [BsonIgnore]
    public static string MongoCollection => "audioSongs";

}
