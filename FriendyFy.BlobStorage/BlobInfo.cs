using System.IO;


namespace FriendyFy.BlobStorage
{
    public class BlobInfo
    {
        public BlobInfo(Stream content, string contentType)
        {
            this.Content = content;
            this.ContentType = contentType;
        }
        public Stream Content { get; set; }
        public string ContentType { get; set; }
    }
}
