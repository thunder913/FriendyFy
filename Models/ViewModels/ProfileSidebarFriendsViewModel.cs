using System.Collections.Generic;

namespace ViewModels
{
    public class ProfileSidebarFriendsViewModel
    {
        public ICollection<ProfileFriendViewModel> Friends { get; set; } = new List<ProfileFriendViewModel>();
        public int FriendsCount { get; set; }
    }
}
