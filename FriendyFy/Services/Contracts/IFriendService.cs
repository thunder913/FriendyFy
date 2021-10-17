using System.Threading.Tasks;

namespace FriendyFy.Services.Contracts
{
    public interface IFriendService
    {
        public Task<bool> AddFriendToUserAsync(string senderId, string receiverId);
    }
}
