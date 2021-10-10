using Microsoft.AspNetCore.Http;

namespace FriendyFy.Data
{
    public class FileModel
    {
        public string FileName { get; set; }
        public IFormFile FormFile { get; set; }
    }
}
