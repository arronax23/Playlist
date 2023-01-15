using MongoDB.Bson;

namespace Playlist.Models.Interfaces;

public interface IDocument
{
    public string? Id { get; set; }
}
