using System;
using FriendyFy.Models.Common;

namespace FriendyFy.Models
{
    public class CommentLike : BaseModel<string>, IAuditInfo
    {
        public new string Id { get; set; } = Guid.NewGuid().ToString();
        public ApplicationUser LikedBy { get; set; }
        public string LikedById { get; set; }
        public PostComment Comment { get; set; }
        public string CommentId { get; set; }
        public EventComment EventComment { get; set; }
        public string EventCommentId { get; set; }
    }
}
