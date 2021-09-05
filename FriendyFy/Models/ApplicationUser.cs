using FriendyFy.Models.Common;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace FriendyFy.Models
{
    public class ApplicationUser : IdentityUser, IAuditInfo, IDeletableEntity
    {
        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedOn { get; set; }
        public ICollection<Post> Posts { get; set; } = new HashSet<Post>();
        public ICollection<Interest> Interests { get; set; } = new HashSet<Interest>();
        public ICollection<Event> Events { get; set; } = new HashSet<Event>();
        public ICollection<UserFriend> Friends { get; set; } = new HashSet<UserFriend>();
    }
}
