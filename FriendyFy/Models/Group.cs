using FriendyFy.Models.Common;
using FriendyFy.Models.Enums;
using System.Collections.Generic;

namespace FriendyFy.Models
{
    public class Group : BaseDeletableModel<string>
    {
        public string Name { get; set; }
        public virtual ICollection<ApplicationUser> Users { get; set; } = new HashSet<ApplicationUser>();
        public virtual ICollection<Interest> Interests { get; set; } = new HashSet<Interest>();
        public virtual Chat Chat { get; set;}
        public PrivacySettings PrivacyStatus { get; set; } = PrivacySettings.Public;
    }
}