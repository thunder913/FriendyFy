using FriendyFy.Models.Common;
using System.Collections;
using System.Collections.Generic;

namespace FriendyFy.Models
{
    public class Interest : BaseDeletableModel<int>
    {
        public ICollection<ApplicationUser> Users { get; set; } = new HashSet<ApplicationUser>();
        public string Name { get; set; }
    }
}
