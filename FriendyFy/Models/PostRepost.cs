using FriendyFy.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Models
{
    public class PostRepost : BaseModel<string>, IAuditInfo
    {
        public ApplicationUser User { get; set; }
        public Post Post { get; set; }
    }
}
