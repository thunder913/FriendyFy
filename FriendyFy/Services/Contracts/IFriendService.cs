using System.Collections.Generic;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface IFriendService
    {
        Task<bool> AddFriendToUserAsync(string senderId, string receiverUsername);
        string GetUserFriendStatus(string userId, string friendUsername);
        Task<bool> CancelFriendRequestAsync(string senderId, string receiverUsername);
        Task<bool> AcceptFriendRequestAsync(string senderId, string receiverUsername);
        Task<bool> RemoveFriendAsync(string senderId, string receiverUsername);
        List<ProfileFriendViewModel> GetUserFriends(string userId, int count);
        int GetUserFriendsCount(string userId);
        List<SidebarFriendRecommendationViewModel> GetFriendRecommendations(string userId);
        Task RemovePersonFromSuggestionsAsync(string userId, string removedUsername);
    }
}
