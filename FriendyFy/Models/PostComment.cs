using FriendyFy.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Models
{
    public class PostComment : BaseModel<string>, IAuditInfo
    {
        public ApplicationUser CommentedBy { get; set; }
        public Post Post { get; set; }
        public string Text { get; set; }
    }
}
