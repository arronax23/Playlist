using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Playlist.Models.Interfaces;

namespace Playlist.Models;

public class Song : IDocument
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string Author { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string ImgPath { get; set; } = null!;
    public string AudioPath { get; set; } = null!;

}
