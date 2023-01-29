using FriendyFy.Models.Common;
using System;
using System.Collections.Generic;

namespace FriendyFy.Models
{
    public class PostComment : BaseModel<string>, IAuditInfo
    {
        public new string Id = Guid.NewGuid().ToString();
        public string CommentedById { get; set; }
        public ApplicationUser CommentedBy { get; set; }
        public string PostId { get; set; }
        public Post Post { get; set; }
        public string Text { get; set; }
        public ICollection<CommentLike> CommentLikes { get; set; } = new HashSet<CommentLike>();
    }
}
