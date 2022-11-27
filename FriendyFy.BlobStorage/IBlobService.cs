using System.Collections.Generic;
using System.Threading.Tasks;

namespace FriendyFy.BlobStorage
{
    public interface IBlobService
    {
        public Task<BlobInfo> GetBlobAsync(string name, string blob);
        public Task<IEnumerable<string>> ListBlobAsync(string blob);
        public Task UploadFileBlobAsync(string filePath, string fileName, string blob);
        public Task UploadContentBlobAsync(string content, string fileName, string blob);
        public Task DeleteBlobAsync(string blobName, string blob);
        public Task UploadBase64StringAsync(string content, string fileName, string blob);
        public Task<string> GetBlobUrlAsync(string name, string blob);
    }
}