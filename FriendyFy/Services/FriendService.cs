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
        private readonly IDeletableEntityRepository<Chat> chatRepository;

        private IUserService userService { get; set; }
        private IBlobService blobService { get; set; }
        private IRepository<RemoveSuggestionFriend> removeSuggestionRepository { get; set; }
        public FriendService(IRepository<UserFriend> userFriendRepository, 
            IDeletableEntityRepository<ApplicationUser> userRepository, 
            IUserService userService,
            IBlobService blobService, 
            IRepository<RemoveSuggestionFriend> removeSuggestionRepository,
            IDeletableEntityRepository<Chat> chatRepository)
        {
            this.userFriendRepository = userFriendRepository;
            this.userRepository = userRepository;
            this.userService = userService;
            this.blobService = blobService;
            this.removeSuggestionRepository = removeSuggestionRepository;
            this.chatRepository = chatRepository;
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

            await this.chatRepository.AddAsync(new Chat()
            {
                ChatType = Models.Enums.ChatType.Direct,
                CreatedOn = DateTime.Now,
                Users = new HashSet<ApplicationUser>() { userOne, userTwo }
            });

            await userRepository.SaveChangesAsync();
            await this.chatRepository.SaveChangesAsync();

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
            var user = this.userRepository.All()
                .Include(x => x.Friends)
                .Include(x => x.RemoveSuggestionFriends)
                .FirstOrDefault(x => x.Id == userId);
            var rand = new Random();
            // TODO optimize the request
            var recommendations = this.userRepository
                .All()
                .Include(x => x.Friends)
                .Include(x => x.Interests)
                .Include(x => x.RemoveSuggestionFriends)
                .ToList()
                .Where(x => 
                !user.RemoveSuggestionFriends.Any(y => y.BlockedUserId == x.Id)
                && ((x.Latitude < user.Latitude && x.Latitude + 5 > user.Latitude) || (x.Latitude - 5 < user.Latitude && x.Latitude > user.Latitude))
                && ((x.Longitude < user.Longitude && x.Longitude + 5 > user.Longitude) || (x.Longitude - 5 < user.Longitude && x.Longitude > user.Longitude))
                && !user.Friends.Any(y => y.FriendId == x.Id
                && x.Id != user.Id)
                )
                .OrderByDescending(x => x.Interests.Count(y => user.Interests.Any(z => z.Id == y.Id)) * 0.5 
                + x.Friends.Count(y => user.Friends.Any(z => z.FriendId == y.Id)) * 0.1 
                + rand.Next((int)((-x.Friends.Count()-x.Interests.Count())*0.2), (int)((x.Friends.Count() + x.Interests.Count()) * 0.2)))
                .Select(x => new SidebarFriendRecommendationViewModel()
                {
                    Name = x.FirstName + " " + x.LastName,
                    Username = x.UserName,
                    CommonInterests = x.Interests.Count(y => user.Interests.Any(z => z.Id == y.Id)),
                    MutualFriends = x.Friends.Count(y => user.Friends.Any(z => z.FriendId == y.Id)),
                    ProfilePhoto = this.blobService.GetBlobUrlAsync(x.UserName + ".jpeg", GlobalConstants.BlobProfilePictures).GetAwaiter().GetResult()
                })
                .Take(6)
                .ToList();

            return recommendations;
        }

        public async Task RemovePersonFromSuggestionsAsync(string userId, string removedUsername)
        {
            var user = this.userService.GetByUsername(removedUsername);

            var model = new RemoveSuggestionFriend()
            {
                BlockedUserId = user.Id,
                BlockedUser = user,
                CreatedOn = DateTime.Now,
                UserId = userId
            };

            await this.removeSuggestionRepository.AddAsync(model);
            await this.removeSuggestionRepository.SaveChangesAsync();
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
