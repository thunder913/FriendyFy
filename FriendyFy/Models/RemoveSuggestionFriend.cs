using FriendyFy.Models.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Models
{
    public class RemoveSuggestionFriend : BaseModel<string>
    {
        public new string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public string BlockedUserId { get; set; }
        public ApplicationUser BlockedUser { get; set; }
    }
}
