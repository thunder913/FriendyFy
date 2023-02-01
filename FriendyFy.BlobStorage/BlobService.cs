using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace FriendyFy.BlobStorage;

public class BlobService : IBlobService
{
    private const string UploadRegex = @"^[\w/\:.-]+;base64,";
    private readonly BlobServiceClient blobServiceClient;
    public BlobService(BlobServiceClient blobServiceClient)
    {
        this.blobServiceClient = blobServiceClient;
    }

    public async Task DeleteBlobAsync(string blobName, string blob)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(blob);
        var blobClient = containerClient.GetBlobClient(blobName);

        await blobClient.DeleteIfExistsAsync();
    }

    public async Task<BlobInfo> GetBlobAsync(string name, string blob)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(blob);
        var blobClient = containerClient.GetBlobClient(name);
        var blobDownloadInfo = await blobClient.DownloadAsync();
        return new BlobInfo(blobDownloadInfo.Value.Content, blobDownloadInfo.Value.ContentType);
    }

    public async Task<IEnumerable<string>> ListBlobAsync(string blob)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(blob);
        var items = new List<string>();
        var blobItems = containerClient.GetBlobs();
        await foreach(var blobItem in containerClient.GetBlobsAsync())
        {
            items.Add(blobItem.Name);
        }

        return items;
    }

    public async Task UploadContentBlobAsync(string content, string fileName, string blob)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(blob);
        var blobClient = containerClient.GetBlobClient(fileName);
           
        var bytes = Encoding.UTF8.GetBytes(content);
        using var memoryStream = new MemoryStream(bytes);
        await blobClient.UploadAsync(memoryStream, new BlobHttpHeaders { ContentType = fileName.GetContentType() });
    }

    public async Task UploadBase64StringAsync(string content, string fileName, string blob)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(blob);
        var blobClient = containerClient.GetBlobClient(fileName);
        Regex regex = new Regex(UploadRegex);
        content = regex.Replace(content, string.Empty);
        var bytes = Convert.FromBase64String(content);

        using var memoryStream = new MemoryStream(bytes);
        await blobClient.UploadAsync(memoryStream, new BlobHttpHeaders { ContentType = fileName.GetContentType() });
    }

    public async Task UploadFileBlobAsync(string filePath, string fileName, string blob)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(blob);
        var blobClient = containerClient.GetBlobClient(fileName);

        await blobClient.UploadAsync(filePath, new BlobHttpHeaders { ContentType = filePath.GetContentType() });
    }
        
    public async Task<string> GetBlobUrlAsync(string name, string blob)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            name = "defaultPicture.jpg";
        }

        var containerClient = blobServiceClient.GetBlobContainerClient(blob);
        var blobClient = containerClient.GetBlobClient(name);
        return blobClient.Uri.AbsoluteUri;
    }
}