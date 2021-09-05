﻿using FriendyFy.Models.Common;
using FriendyFy.Models.Enums;
using System;
using System.Collections.Generic;

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
        //TODO Store google geolocation
    }
}
