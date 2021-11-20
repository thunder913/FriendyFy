using FriendyFy.Models.Common;
using System;

namespace FriendyFy.Models
{
    public class CommentLike : BaseModel<string>, IAuditInfo
    {
        public new string Id { get; set; } = Guid.NewGuid().ToString();
        public ApplicationUser LikedBy { get; set; }
        public string LikedById { get; set; }
        public PostComment Comment { get; set; }
        public string CommentId { get; set; }
    }
}
