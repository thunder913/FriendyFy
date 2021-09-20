using FriendyFy.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Models
{
    public class PostLike : BaseModel<string>, IAuditInfo
    {
        public ApplicationUser LikedBy { get; set; }
        public Post Post { get; set; }
    }
}
