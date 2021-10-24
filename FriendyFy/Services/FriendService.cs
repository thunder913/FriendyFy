using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Services
{
    public class FriendService : IFriendService
    {
        private IRepository<UserFriend> userFriendRepository { get; set; }
        private readonly IDeletableEntityRepository<ApplicationUser> userRepository;
        private IUserService userService { get; set; }
        private IBlobService blobService { get; set; }
        public FriendService(IRepository<UserFriend> userFriendRepository, IDeletableEntityRepository<ApplicationUser> userRepository, IUserService userService = null, IBlobService blobService = null)
        {
            this.userFriendRepository = userFriendRepository;
            this.userRepository = userRepository;
            this.userService = userService;
            this.blobService = blobService;
        }

        public async Task<bool> AddFriendToUserAsync(string senderId, string receiverUsername)
        {
            var friendStatus = this.GetUserFriendStatus(senderId, receiverUsername);

            if (friendStatus != "no-friends")
            {
                return false;
            }

            var userOne = userService.GetById(senderId);
            var userTwo = userService.GetByUsername(receiverUsername);
            if (!this.AreUsersValid(userOne, userTwo))
            {
                return false;
            }

            userOne.Friends.Add(new UserFriend() { IsFriend = false, FriendId = userTwo.Id, RequestSenderId = senderId });
            userTwo.Friends.Add(new UserFriend() { IsFriend = false, FriendId = userOne.Id, RequestSenderId = senderId });

            await userRepository.SaveChangesAsync();

            return true;
        }

        public async Task<bool> CancelFriendRequestAsync(string senderId, string receiverUsername)
        {
            var friendStatus = this.GetUserFriendStatus(senderId, receiverUsername);

            if (friendStatus != "received" && friendStatus != "requested")
            {
                return false;
            }

            var userOne = userService.GetById(senderId);
            var userTwo = userService.GetByUsername(receiverUsername);
            if (!this.AreUsersValid(userOne, userTwo))
            {
                return false;
            }

            var userOneFriend = userOne.Friends.FirstOrDefault(x => x.FriendId == userTwo.Id);
            var userTwoFriend = userTwo.Friends.FirstOrDefault(x => x.FriendId == userOne.Id);

            this.userFriendRepository.Delete(userOneFriend);
            this.userFriendRepository.Delete(userTwoFriend);
            
            await userFriendRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveFriendAsync(string senderId, string receiverUsername)
        {
            var friendStatus = this.GetUserFriendStatus(senderId, receiverUsername);

            if (friendStatus != "friends")
            {
                return false;
            }

            var userOne = userService.GetById(senderId);
            var userTwo = userService.GetByUsername(receiverUsername);

            if (!this.AreUsersValid(userOne, userTwo))
            {
                return false;
            }

            var userOneFriend = userOne.Friends.FirstOrDefault(x => x.FriendId == userTwo.Id);
            var userTwoFriend = userTwo.Friends.FirstOrDefault(x => x.FriendId == userOne.Id);

            this.userFriendRepository.Delete(userOneFriend);
            this.userFriendRepository.Delete(userTwoFriend);

            await userFriendRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AcceptFriendRequestAsync(string senderId, string receiverUsername)
        {
            var friendStatus = this.GetUserFriendStatus(senderId, receiverUsername);

            if (friendStatus != "received" && friendStatus != "requested")
            {
                return false;
            }

            var userOne = userService.GetById(senderId);
            var userTwo = userService.GetByUsername(receiverUsername);
            if (!this.AreUsersValid(userOne, userTwo))
            {
                return false;
            }

            var userOneFriend = userOne.Friends.FirstOrDefault(x => x.FriendId == userTwo.Id);
            var userTwoFriend = userTwo.Friends.FirstOrDefault(x => x.FriendId == userOne.Id);

            if (userOneFriend == null || userTwoFriend == null)
            {
                return false;
            }

            userOneFriend.IsFriend = true;
            userTwoFriend.IsFriend = true;
            userOneFriend.ModifiedOn = DateTime.UtcNow;
            userTwoFriend.ModifiedOn = DateTime.UtcNow;

            await userFriendRepository.SaveChangesAsync();
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

        public List<ProfileFriendViewModel> GetUserFriends(string userId, int count)
        {
            return this.userFriendRepository
                .All()
                .Include(x => x.Friend)
                .Include(x => x.CurrentUser)
                .Where(x => x.CurrentUser.UserName==userId && x.IsFriend)
                .Take(count)
                .Select(x => new ProfileFriendViewModel()
                {
                    FullName = x.Friend.FirstName + " " + x.Friend.LastName,
                    ProfileImage = this.blobService.GetBlobUrlAsync(x.Friend.UserName + ".jpeg", GlobalConstants.BlobProfilePictures).GetAwaiter().GetResult(),
                    Username = x.Friend.UserName,
                })
                .ToList();
        }

        public int GetUserFriendsCount(string userId)
        {
            return this.userFriendRepository
                .All()
                .Include(x => x.CurrentUser)
                .Where(x => x.CurrentUser.UserName == userId && x.IsFriend)
                .Count();
        }

        public List<SidebarFriendRecommendationViewModel> GetFriendRecommendations(string userId)
        {
            var user = this.userService.GetById(userId);

            var recommendations = this.userRepository
                .All()
                .Include(x => x.Friends)
                .Include(x => x.Interests)
                .ToList()
                .Where(x => (x.Latitude + 5 > user.Latitude || x.Latitude - 5 < user.Latitude)
                && (x.Longitude + 5 > user.Longitude || x.Longitude - 5 < user.Longitude)
                && !user.Friends.Any(y => y.FriendId == x.Id)
                )
                .OrderByDescending(x => x.Interests.Count(y => user.Interests.Any(z => z.Id == y.Id)) * 0.5 + x.Friends.Count(y => user.Friends.Any(z => z.FriendId == y.Id)) * 0.1 + "add random number so that they differ")
                .Select(x => new SidebarFriendRecommendationViewModel()
                {
                    Name = x.FirstName + " " + x.LastName,
                    Username = x.UserName,
                    CommonInterests = x.Interests.Count(y => user.Interests.Any(z => z.Id == y.Id)),
                    MutualFriends = x.Friends.Count(y => user.Friends.Any(z => z.FriendId == y.Id)),
                })
                .Take(6)
                .ToList();

            return recommendations;
        }

        private bool AreUsersValid(ApplicationUser userOne, ApplicationUser userTwo)
        {
            if (userOne == null || userTwo == null)
            {
                return false;
            }

            return true;
        }
    }
}
