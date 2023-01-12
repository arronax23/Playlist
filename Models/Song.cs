using MongoDB.Bson;
using Playlist.Models.Interfaces;

namespace Playlist.Models;

public class Song : IDocument
{
    public ObjectId _id { get; set; }
    public string Author { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string ImgPath { get; set; } = null!;
    public string AudioPath { get; set; } = null!;

}
