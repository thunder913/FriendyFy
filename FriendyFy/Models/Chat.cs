using FriendyFy.Models.Common;
using FriendyFy.Models.Enums;
using System;
using System.Collections.Generic;

namespace FriendyFy.Models
{
    public class Chat : BaseDeletableModel<string>
    {
        public new string Id { get; set; } = Guid.NewGuid().ToString();
        public ICollection<ApplicationUser> Users { get; set; } = new HashSet<ApplicationUser>();
        public string Name { get; set; }
        public ICollection<Message> Messages { get; set; } = new HashSet<Message>();
        public ChatType ChatType { get; set; }
    }
}
