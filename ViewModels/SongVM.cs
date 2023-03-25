using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace Playlist.ViewModels;

public enum SongType {Audio , Video };
public class SongVM
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public SongType Type { get; set; }
    public string Author { get; set; } = null!;
    public string Title { get; set; } = null!;
    public bool CustomImg { get; set; }
    public string ImgPath { get; set; } = null!;
    public string AudioPath { get; set; } = null!;
    public string VideoPath { get; set; } = null!;
    public DateTime CreatedDate { get; set; }
}
