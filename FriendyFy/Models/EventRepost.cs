using FriendyFy.Models.Common;

namespace FriendyFy.Models
{
    public class EventRepost : BaseModel<string>, IAuditInfo
    {
        public ApplicationUser User { get; set; }
        public string UserId { get; set; }
        public Event Event { get; set; }
        public string EventId { get; set; }
    }
}
