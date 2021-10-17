using FriendyFy.Models.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Models
{
    public class UserFriend : BaseModel<string>
    {
        [Key]
        public new string Id { get; set; } = new Guid().ToString();
        public ApplicationUser Friend { get; set; }
        public string FriendId { get; set; }
        public bool IsFriend { get; set; }
    }
}
