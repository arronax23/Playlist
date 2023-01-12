using MongoDB.Bson;

namespace Playlist.Models.Interfaces;

public interface IDocument
{
    ObjectId _id { get; set; }
}
