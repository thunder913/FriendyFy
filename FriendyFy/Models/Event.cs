using FriendyFy.Models.Common;
using System.Collections;
using System.Collections.Generic;

namespace FriendyFy.Models
{
    public class Event : BaseDeletableModel<string>
    {
        public ICollection<ApplicationUser> Users { get; set; } = new HashSet<ApplicationUser>();
    }
}
