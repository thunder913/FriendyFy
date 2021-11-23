using FriendyFy.Models.Common;
using FriendyFy.Models.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FriendyFy.Models
{
    public class Event : BaseDeletableModel<string>
    {
        public virtual ICollection<ApplicationUser> Users { get; set; } = new HashSet<ApplicationUser>();
        public virtual ICollection<Interest> Interests { get; set; } = new HashSet<Interest>();
        public virtual Chat Chat { get; set; }
        public PrivacySettings PrivacySettings { get; set; }
        public DateTime Time { get; set; }
        public bool IsReocurring{ get; set; }
        [Column(TypeName = "decimal(11, 8)")]
        public decimal? Latitude { get; set; }
        [Column(TypeName = "decimal(11, 8)")]
        public decimal? Longitude { get; set; }
        public string LocationCity { get; set; }
        public string Name { get; set; }
        public ApplicationUser Organizer { get; set; }
        public string OrganizerId { get; set; }
        public string Description { get; set; }
    }
}
