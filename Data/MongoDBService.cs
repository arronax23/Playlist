using MongoDB.Bson;
using MongoDB.Driver;
using Playlist.Models.Interfaces;

namespace Playlist.Data;

public class MongoDBService
{
    private static string? _connectionString;
    private readonly MongoClient _client;

    public MongoDBService(IConfiguration configuration)
    {
        _connectionString = configuration["ConnectionStrings:MongoDbConnection"];
        _client = new MongoClient(_connectionString);
    }

    public IEnumerable<CollectionType> ReadCollection<CollectionType>(string database, string collection)
    {
        var mongoCollection =
            _client
                .GetDatabase(database)
                .GetCollection<CollectionType>(collection);

        return mongoCollection.AsQueryable().AsEnumerable();
    }

    public CollectionType GetOneDocument<CollectionType>(string database, string collection, string? id)
              where CollectionType : IDocument
    {
        var mongoCollection =
            _client
                .GetDatabase(database)
                .GetCollection<CollectionType>(collection);

        var document = mongoCollection.Find(doc => doc.Id == id).SingleOrDefault();
        return document;
    }


    public void Insert<CollectionType>(string database, string collection, CollectionType document)
    {
        var mongoCollection =
            _client
                .GetDatabase(database)
                .GetCollection<CollectionType>(collection);

        mongoCollection.InsertOne(document);
    }


    public void Update<CollectionType>(string database, string collection, string? id, CollectionType newDocument)
        where CollectionType : IDocument
    {
        var mongoCollection =
            _client
                .GetDatabase(database)
                .GetCollection<CollectionType>(collection);

        var properties = typeof(CollectionType).GetProperties();

        FilterDefinition<CollectionType> filterDefinition = Builders<CollectionType>.Filter.Eq(document => document.Id, id);

        var updateDefinitionBuilder = Builders<CollectionType>.Update;
        var updateDefinitionList = new List<UpdateDefinition<CollectionType>>();

        foreach (var property in properties)
        {
            if (property.Name != "Id")
                updateDefinitionList.Add(updateDefinitionBuilder.Set(property.Name, property.GetValue(newDocument)));
        }

        mongoCollection.UpdateOne(filterDefinition, updateDefinitionBuilder.Combine(updateDefinitionList));
    }

    public void DeleteDocument<CollectionType>(string database, string collection, string? id)
        where CollectionType : IDocument
    {
        var mongoCollection =
            _client
                .GetDatabase(database)
                .GetCollection<CollectionType>(collection);


        FilterDefinition<CollectionType> filterDefinition = Builders<CollectionType>.Filter.Eq(document => document.Id, id);
        mongoCollection.DeleteOne(filterDefinition);
    }

}
