using FriendyFy.Models.Common;
using System.Collections.Generic;

namespace FriendyFy.Models
{
    public class Chat : BaseDeletableModel<string>
    {
        public ICollection<ApplicationUser> Users { get; set; } = new HashSet<ApplicationUser>();
        public string Name { get; set; }
        public ICollection<Message> Messages { get; set; } = new HashSet<Message>();
    }
}
