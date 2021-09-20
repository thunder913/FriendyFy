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
        public string Id { get; set; } = new Guid().ToString();
        public ApplicationUser Friend { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
