using System.Threading.Tasks;

namespace FriendyFy.Services.Contracts
{
    public interface IFriendService
    {
        Task<bool> AddFriendToUserAsync(string senderId, string receiverUsername);
        string GetUserFriendStatus(string userId, string friendUsername);
    }
}
