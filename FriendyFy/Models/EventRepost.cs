using FriendyFy.Models.Common;

namespace FriendyFy.Models
{
    public class EventRepost : BaseModel<string>, IAuditInfo
    {
        public ApplicationUser User { get; set; }
        public string UserId { get; set; }
        public EventPost EventPost { get; set; }
        public string EventPostId { get; set; }
    }
}
