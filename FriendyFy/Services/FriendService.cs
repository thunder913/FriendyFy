using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using FriendyFy.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace FriendyFy.Services;

public class FriendService : IFriendService
{
    private IRepository<UserFriend> userFriendRepository { get; }
    private readonly IDeletableEntityRepository<ApplicationUser> userRepository;
    private readonly IDeletableEntityRepository<Chat> chatRepository;

    private IUserService userService { get; }
    private IBlobService blobService { get; }
    private IRepository<RemoveSuggestionFriend> removeSuggestionRepository { get; }
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
        var friendStatus = await GetUserFriendStatusAsync(senderId, receiverUsername);

        // TODO make enum
        if (friendStatus != "no-friends")
        {
            return false;
        }

        var userOne = await userService.GetByIdAsync(senderId);
        var userTwo = await userService.GetByUsernameAsync(receiverUsername);
        if (!AreUsersValid(userOne, userTwo))
        {
            return false;
        }

        userOne.Friends.Add(new UserFriend { IsFriend = false, FriendId = userTwo.Id, RequestSenderId = senderId });
        userTwo.Friends.Add(new UserFriend { IsFriend = false, FriendId = userOne.Id, RequestSenderId = senderId });

        var chat = await chatRepository
            .All()
            .Include(x => x.Users)
            .FirstOrDefaultAsync(x => x.Users.Any(y => y.Id == userOne.Id) && x.Users.Any(y => y.Id == userTwo.Id));
        
        if (chat == null)
        {
            chatRepository.Add(new Chat
            {
                ChatType = ChatType.NotAccepted,
                CreatedOn = DateTime.Now,
                Users = new HashSet<ApplicationUser> { userOne, userTwo }
            });
        }
        await userRepository.SaveChangesAsync();

        return true;
    }

    public async Task<bool> CancelFriendRequestAsync(string senderId, string receiverUsername)
    {
        var friendStatus = await GetUserFriendStatusAsync(senderId, receiverUsername);
        
        // TODO make enum
        if (friendStatus != "received" && friendStatus != "requested")
        {
            return false;
        }

        var userOne = await userService.GetByIdAsync(senderId);
        var userTwo = await userService.GetByUsernameAsync(receiverUsername);
        
        if (!AreUsersValid(userOne, userTwo))
        {
            return false;
        }

        var userOneFriend = userOne.Friends.FirstOrDefault(x => x.FriendId == userTwo.Id);
        var userTwoFriend = userTwo.Friends.FirstOrDefault(x => x.FriendId == userOne.Id);

        userFriendRepository.Delete(userOneFriend);
        userFriendRepository.Delete(userTwoFriend);
            
        await userFriendRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveFriendAsync(string senderId, string receiverUsername)
    {
        var friendStatus = await GetUserFriendStatusAsync(senderId, receiverUsername);

        // TODO make enum
        if (friendStatus != "friends")
        {
            return false;
        }

        var userOne = await userService.GetByIdAsync(senderId);
        var userTwo = await userService.GetByUsernameAsync(receiverUsername);

        if (!AreUsersValid(userOne, userTwo))
        {
            return false;
        }

        var userOneFriend = userOne.Friends.FirstOrDefault(x => x.FriendId == userTwo.Id);
        var userTwoFriend = userTwo.Friends.FirstOrDefault(x => x.FriendId == userOne.Id);

        userFriendRepository.Delete(userOneFriend);
        userFriendRepository.Delete(userTwoFriend);

        await userFriendRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AcceptFriendRequestAsync(string senderId, string receiverUsername)
    {
        var friendStatus = await GetUserFriendStatusAsync(senderId, receiverUsername);

        // TODO make enum
        if (friendStatus != "received" && friendStatus != "requested")
        {
            return false;
        }

        var userOne = await userService.GetByIdAsync(senderId);
        var userTwo = await userService.GetByUsernameAsync(receiverUsername);
        if (!AreUsersValid(userOne, userTwo))
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

        var chat = await chatRepository
            .All()
            .Include(x => x.Users)
            .FirstOrDefaultAsync(x => x.Users.Any(y => y.Id == userOneFriend.CurrentUserId) && x.Users.Any(y => y.Id == userTwoFriend.CurrentUserId) && (x.ChatType == ChatType.NotAccepted || x.ChatType == ChatType.Direct));
        
        if (chat != null)
        {
            chat.ChatType = ChatType.Direct;
        }

        await userFriendRepository.SaveChangesAsync();
            
        return true;
    } 

    public async Task<string> GetUserFriendStatusAsync(string userId, string friendUsername)
    {
        // TODO make enum
        var user = await userRepository.All().Include(x => x.Friends).FirstOrDefaultAsync(x => x.Id == userId);
        var friend = userRepository.All().FirstOrDefault(x => x.UserName == friendUsername);
        if (user == null)
        {
            return "invalid";
        }

        if(user.Id == friend?.Id)
        {
            return "same-user";
        }

        var userFriend = user.Friends.FirstOrDefault(x => x.FriendId == friend.Id);
        if (userFriend != null)
        {
            if (userFriend.IsFriend)
            {
                return "friends";
            }
            if (!userFriend.IsFriend && userFriend.RequestSenderId == userId)
            {
                return "requested";
            }
            return "received";
        }

        return "no-friends";
    }

    public List<ProfileFriendViewModel> GetUserFriends(string userId, int skip, int count, string loggedIn, string searchQuery)
    {
        var user = userRepository.All().FirstOrDefault(x => x.Id == loggedIn);
        
        // TODO use dto and AutoMapper
        return userFriendRepository
            .All()
            .Include(x => x.Friend)
            .ThenInclude(x => x.Friends)
            .Include(x => x.Friend)
            .ThenInclude(x => x.ProfileImage)
            .Include(x => x.CurrentUser)
            .Where(x => x.CurrentUser.UserName==userId && x.IsFriend)
            .Where(x => string.IsNullOrEmpty(searchQuery) || (x.Friend.FirstName + " " + x.Friend.LastName).ToLower().Contains(searchQuery.ToLower()))
            .OrderBy(x => x.CreatedOn)
            .ToList()
            .Select(x => new ProfileFriendViewModel
            {
                FullName = x.Friend.FirstName + " " + x.Friend.LastName,
                ProfileImage = blobService.GetBlobUrlAsync(x.Friend.ProfileImage?.Id + x.Friend.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                Username = x.Friend.UserName,
                HasReceived = !string.IsNullOrWhiteSpace(loggedIn) && x.Friend.Friends.Any(y => !y.IsFriend && y.FriendId==loggedIn && y.RequestSenderId==x.Id),
                HasRequested = !string.IsNullOrWhiteSpace(loggedIn) && x.Friend.Friends.Any(y => !y.IsFriend && y.RequestSenderId==loggedIn),
                IsFriend = !string.IsNullOrWhiteSpace(loggedIn) && x.Friend.Friends.Any(y => y.IsFriend && y.FriendId==loggedIn),
                MutualFriends = !string.IsNullOrWhiteSpace(loggedIn) ? x.Friend.Friends.Where(x => x.IsFriend).Count(y => y.CurrentUserId != loggedIn && y.FriendId != loggedIn && user.Friends.Where(x => x.IsFriend).Any(z => z.FriendId == y.FriendId)) : -1,
                IsLoggedUser = x.Friend.Id == loggedIn
            })
            .OrderByDescending(x => x.IsFriend)
            .ThenByDescending(x => x.HasRequested)
            .ThenByDescending(x => x.HasReceived)
            .Skip(skip)
            .Take(count)
            .ToList();
    }

    public async Task<int> GetUserFriendsCountAsync(string userId)
    {
        return await userFriendRepository
            .All()
            .Include(x => x.CurrentUser)
            .CountAsync(x => x.CurrentUser.UserName == userId && x.IsFriend);
    }

    public async Task<List<SidebarFriendRecommendationViewModel>> GetFriendRecommendations(string userId)
    {
        var user = await userRepository.All()
            .Include(x => x.Friends)
            .Include(x => x.RemoveSuggestionFriends)
            .FirstOrDefaultAsync(x => x.Id == userId);
        var rand = new Random();

        const int takeFriendsCount = 6;
        // TODO optimize the request, use DTO and AutoMapper
        var recommendations = userRepository
            .All()
            .Include(x => x.Friends)
            .Include(x => x.ProfileImage)
            .Include(x => x.Interests)
            .Include(x => x.RemoveSuggestionFriends)
            .Where(x =>
                x.Id != user.Id
                && !user.RemoveSuggestionFriends.Select(y => y.Id).Contains(x.Id)
                && ((x.Latitude < user.Latitude && x.Latitude + 5 > user.Latitude) || (x.Latitude - 5 < user.Latitude && x.Latitude > user.Latitude))
                && ((x.Longitude < user.Longitude && x.Longitude + 5 > user.Longitude) || (x.Longitude - 5 < user.Longitude && x.Longitude > user.Longitude))
                && !user.Friends.Select(y => y.Id).Contains(x.Id)
            )
            .Take(takeFriendsCount)
            .ToList()

            .OrderByDescending(x => x.Interests.Count(y => user.Interests.Any(z => z.Id == y.Id)) * 0.5 
                                    + x.Friends.Where(x => x.IsFriend).Count(y => user.Friends.Any(z => z.FriendId == y.Id)) * 0.1 
                                    + rand.Next((int)((-x.Friends.Count(x => x.IsFriend)-x.Interests.Count)*0.2), (int)((x.Friends.Count(x => x.IsFriend) + x.Interests.Count) * 0.2)))
            .Select(x => new SidebarFriendRecommendationViewModel
            {
                Name = x.FirstName + " " + x.LastName,
                Username = x.UserName,
                CommonInterests = x.Interests.Count(y => user.Interests.Any(z => z.Id == y.Id)),
                MutualFriends = x.Friends.Where(x => x.IsFriend).Count(y => user.Friends.Any(z => z.FriendId == y.FriendId)),
                ProfilePhoto = blobService.GetBlobUrlAsync(x.ProfileImage?.Id + x.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult()
            })
            .ToList();

        if(recommendations.Count < takeFriendsCount)
        {
            // TODO use dto and AutoMapper
            recommendations.AddRange(userRepository
                .All()
                .Include(x => x.Friends)
                .Include(x => x.Interests)
                .Include(x => x.RemoveSuggestionFriends)
                .Where(x =>
                    x.Id != user.Id
                    && !user.RemoveSuggestionFriends.Select(y => y.BlockedUserId).Contains(x.Id) 
                    && !user.Friends.Select(y => y.FriendId).Contains(x.Id))
                .Where(x => !recommendations.Select(y => y.Username).Contains(x.UserName))
                .Take(takeFriendsCount - recommendations.Count)
                .ToList()
                .OrderByDescending(x => x.Interests.Count(y => user.Interests.Any(z => z.Id == y.Id)) * 0.5
                                        + x.Friends.Where(x => x.IsFriend).Count(y => user.Friends.Any(z => z.FriendId == y.Id)) * 0.1
                                        + rand.Next((int)((-x.Friends.Count(x => x.IsFriend) - x.Interests.Count) * 0.2), (int)((x.Friends.Count(x => x.IsFriend) + x.Interests.Count) * 0.2)))
                .Select(x => new SidebarFriendRecommendationViewModel
                {
                    Name = x.FirstName + " " + x.LastName,
                    Username = x.UserName,
                    CommonInterests = x.Interests.Count(y => user.Interests.Any(z => z.Id == y.Id)),
                    MutualFriends = x.Friends.Where(x => x.IsFriend).Count(y => user.Friends.Any(z => z.FriendId == y.FriendId)),
                    ProfilePhoto = blobService.GetBlobUrlAsync(x.ProfileImage?.Id + x.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult()
                })
                .ToList());
        }

        return recommendations;
    }

    public async Task RemovePersonFromSuggestionsAsync(string userId, string removedUsername)
    {
        var user = await userService.GetByUsernameAsync(removedUsername);

        var model = new RemoveSuggestionFriend
        {
            BlockedUserId = user.Id,
            BlockedUser = user,
            CreatedOn = DateTime.Now,
            UserId = userId
        };

        removeSuggestionRepository.Add(model);
        await removeSuggestionRepository.SaveChangesAsync();
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