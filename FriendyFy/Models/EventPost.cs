using FriendyFy.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Models
{
    public class EventPost : BaseModel<string>, IAuditInfo
    {
        public new string Id { get; set; } = Guid.NewGuid().ToString();
        public Event Event { get; set; }
        public string EventId { get; set; }
        public string CreatorId { get; set; }
        public ApplicationUser Creator { get; set; }
        public ICollection<EventLike> Likes { get; set; } = new HashSet<EventLike>();
        public ICollection<EventComment> Comments { get; set; } = new HashSet<EventComment>();
        public ICollection<EventPost> Reposts { get; set; } = new HashSet<EventPost>();
        public bool IsRepost { get; set; }
        public string Text { get; set; }
        public EventPost Repost { get; set; }
        public string RepostId { get; set; }
    }
}
