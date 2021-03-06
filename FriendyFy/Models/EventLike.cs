using FriendyFy.Models.Common;
using System;

namespace FriendyFy.Models
{
    public class EventLike : BaseModel<string>, IAuditInfo
    {
        public new string Id { get; set; } = Guid.NewGuid().ToString();
        public ApplicationUser LikedBy { get; set; }
        public string LikedById { get; set; }
        public EventPost EventPost { get; set; }
        public string EventPostId { get; set; }
    }
}
