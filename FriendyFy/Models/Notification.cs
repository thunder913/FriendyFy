using FriendyFy.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Models
{
    public class Notification : BaseModel<string>, IAuditInfo
    {
        public new string Id { get; set; } = Guid.NewGuid().ToString();
        public Event Event { get; set; }
        public string EventId { get; set; }
        public ApplicationUser Inviter { get; set; }
        public string InviterId { get; set; }
        public ApplicationUser Invitee { get; set; }
        public string InviteeId { get; set; }
        public bool IsSeen { get; set; }
        public bool IsAvailable { get; set; }
        public new DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        public bool AcceptedStatus { get; set; }
    }
}
