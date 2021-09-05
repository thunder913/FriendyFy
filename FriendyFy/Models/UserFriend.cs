using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Models
{
    public class UserFriend
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public virtual ApplicationUser UserOne { get; set; }
        public string UserOneId { get; set; }
        public virtual ApplicationUser UserTwo { get; set; }
        public string UserTwoId { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
