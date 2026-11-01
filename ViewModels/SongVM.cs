using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Playlist.ViewModels;

public enum SongType { Audio , Video };
public class SongVM
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public SongType Type { get; set; }
    public string Author { get; set; } = null!;
    public string Title { get; set; } = null!;
    public bool CustomImg { get; set; }
    public string ImgFileName { get; set; } = null!;
    public string AudioFileName { get; set; } = null!;
    public string VideoFileName { get; set; } = null!;
    public DateTime CreatedDate { get; set; }
}
