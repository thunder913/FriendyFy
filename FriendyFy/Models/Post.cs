using FriendyFy.Models.Common;

namespace FriendyFy.Models
{
    public class Post : BaseDeletableModel<string>
    {
        public ApplicationUser Creator { get; set; }
    }
}
