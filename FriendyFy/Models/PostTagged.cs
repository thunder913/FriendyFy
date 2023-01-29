using FriendyFy.Models.Common;
using System;

namespace FriendyFy.Models
{
    public class PostTagged : BaseModel<string>, IAuditInfo
    {
        public new string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public string PostId { get; set; }
        public Post Post { get; set; }
    }
}
