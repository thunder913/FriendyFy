using FriendyFy.Models.Common;
using System.Collections;
using System.Collections.Generic;

namespace FriendyFy.Models
{
    public class Interest : BaseDeletableModel<int>
    {
        public ICollection<ApplicationUser> Users { get; set; } = new HashSet<ApplicationUser>();
        public ICollection<Group> Groups { get; set; } = new HashSet<Group>();
        public ICollection<Event> Events { get; set; } = new HashSet<Event>();
        public string Name { get; set; }
    }
}
