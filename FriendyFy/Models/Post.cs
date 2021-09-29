using FriendyFy.Models.Common;
using System.Collections.Generic;

namespace FriendyFy.Models
{
    public class Post : BaseDeletableModel<string>, IAuditInfo
    {
        public ApplicationUser Creator { get; set; }
        public string Text { get; set; }
        public ICollection<Image> Image { get; set; } = new HashSet<Image>();
        public ICollection<PostLike> Likes { get; set; } = new HashSet<PostLike>();
        public ICollection<PostComment> Comments { get; set; } = new HashSet<PostComment>();
        public ICollection<ApplicationUser> Reposts { get; set; } = new HashSet<ApplicationUser>();
    }
}
