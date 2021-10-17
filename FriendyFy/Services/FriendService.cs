using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using System;
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

        public async Task<bool> AddFriendToUserAsync(string senderId, string receiverId)
        {
            var userOne = this.userRepository.All().FirstOrDefault(x => x.Id == senderId);
            var userTwo = this.userRepository.All().FirstOrDefault(x => x.Id == receiverId);
            if (userOne == null || userTwo == null)
            {
                return false;
            }

            userOne.Friends.Add(new UserFriend() { IsFriend = false, FriendId = userTwo.Id });
            userTwo.Friends.Add(new UserFriend() { IsFriend = false, FriendId = userOne.Id });

            await userRepository.SaveChangesAsync();

            return true;
        }
    }
}
