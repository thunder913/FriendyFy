using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Services
{
    public class FriendService : IFriendService
    {
        private IRepository<UserFriend> userFriendRepository { get; set; }
        private readonly IDeletableEntityRepository<ApplicationUser> userRepository;

        public FriendService(IRepository<UserFriend> userFriendRepository, IDeletableEntityRepository<ApplicationUser> userRepository)
        {
            this.userFriendRepository = userFriendRepository;
            this.userRepository = userRepository;
        }

        public async Task<bool> AddFriendToUserAsync(string senderId, string receiverUsername)
        {
            var userOne = this.userRepository.All().Include(x => x.Friends).FirstOrDefault(x => x.Id == senderId);
            var userTwo = this.userRepository.All().Include(x => x.Friends).FirstOrDefault(x => x.UserName == receiverUsername);
            if (userOne == null || userTwo == null || userOne.Friends.Any(x => x.FriendId == userTwo.Id) || userTwo.Friends.Any(x => x.FriendId == userOne.Id))
            {
                return false;
            }

            userOne.Friends.Add(new UserFriend() { IsFriend = false, FriendId = userTwo.Id, RequestSenderId = senderId });
            userTwo.Friends.Add(new UserFriend() { IsFriend = false, FriendId = userOne.Id, RequestSenderId = senderId });

            await userRepository.SaveChangesAsync();

            return true;
        }

        public string GetUserFriendStatus(string userId, string friendUsername)
        {
            var user = this.userRepository.All().Include(x => x.Friends).FirstOrDefault(x => x.Id == userId);
            var friend = this.userRepository.All().FirstOrDefault(x => x.UserName == friendUsername);
            if (user == null)
            {
                return "invalid";
            }

            if(user.Id == friend.Id)
            {
                return "same-user";
            }

            var userFriend = user.Friends.FirstOrDefault(x => x.FriendId == friend.Id);
            if (userFriend != null)
            {
                if (userFriend.IsFriend)
                {
                    return "friends";
                }else if (!userFriend.IsFriend && userFriend.RequestSenderId == userId)
                {
                    return "requested";
                }
                return "received";
            }

            return "no-friends";
        }
    }
}
