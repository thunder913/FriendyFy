using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Data.Dtos;
using FriendyFy.Mapping;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using FriendyFy.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace FriendyFy.Services;

public class FriendService : IFriendService
{
    private readonly IRepository<UserFriend> userFriendRepository;
    private readonly IDeletableEntityRepository<ApplicationUser> userRepository;
    private readonly IDeletableEntityRepository<Chat> chatRepository;
    private readonly IMapper mapper;
    private readonly IUserService userService;
    private readonly IBlobService blobService;
    private readonly IRepository<RemoveSuggestionFriend> removeSuggestionRepository;
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
        mapper = AutoMapperConfig.MapperInstance;
    }

    public async Task<bool> AddFriendToUserAsync(string senderId, string receiverUsername)
    {
        var friendStatus = await GetUserFriendStatusAsync(senderId, receiverUsername);

        if (friendStatus != FriendStatus.NoFriends)
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
        
        if (friendStatus != FriendStatus.Received && friendStatus != FriendStatus.Requested)
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

        if (friendStatus != FriendStatus.Friends)
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

        if (friendStatus != FriendStatus.Received && friendStatus != FriendStatus.Requested)
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

    public async Task<FriendStatus> GetUserFriendStatusAsync(string userId, string friendUsername)
    {
        var user = await userRepository
            .All()
            .Include(x => x.Friends)
            .FirstOrDefaultAsync(x => x.Id == userId);
        
        var friend = userRepository
            .All()
            .FirstOrDefault(x => x.UserName == friendUsername);
        
        if (user == null)
        {
            return FriendStatus.Invalid;
        }

        if(user.Id == friend?.Id)
        {
            return FriendStatus.SameUser;
        }

        var userFriend = user.Friends.FirstOrDefault(x => x.FriendId == friend.Id);
        if (userFriend != null)
        {
            if (userFriend.IsFriend)
            {
                return FriendStatus.Friends;
            }
            if (!userFriend.IsFriend && userFriend.RequestSenderId == userId)
            {
                return FriendStatus.Requested;
            }
            return FriendStatus.Received;
        }

        return FriendStatus.NoFriends;
    }

    public List<ProfileFriendViewModel> GetUserFriends(string userId, int skip, int count, string loggedIn, string searchQuery)
    {
        // Setting to string.Empty, otherwise it is "null" in the sql query
        searchQuery ??= string.Empty;

        var dtos = userFriendRepository
            .All()
            .Where(x => x.CurrentUser.UserName == userId && x.IsFriend)
            .Where(x => string.IsNullOrEmpty(searchQuery) || (x.Friend.FirstName + " " + x.Friend.LastName).ToLower().Contains(searchQuery.ToLower()))
            .OrderBy(x => x.CreatedOn)
            .Select(x => new ProfileFriendDto
            {
                FullName = x.Friend.FirstName + " " + x.Friend.LastName,
                ProfileImageName = x.Friend.ProfileImage.Id + x.Friend.ProfileImage.ImageExtension,
                Username = x.Friend.UserName,
                HasReceived = !string.IsNullOrWhiteSpace(loggedIn) && x.Friend.Friends.Any(y => !y.IsFriend && y.FriendId == loggedIn && y.RequestSenderId == x.Id),
                HasRequested = !string.IsNullOrWhiteSpace(loggedIn) && x.Friend.Friends.Any(y => !y.IsFriend && y.RequestSenderId == loggedIn),
                IsFriend = !string.IsNullOrWhiteSpace(loggedIn) && x.Friend.Friends.Any(y => y.IsFriend && y.FriendId == loggedIn),
                MutualFriends = !string.IsNullOrWhiteSpace(loggedIn) 
                    ? x.Friend.Friends.Count(y => y.IsFriend == true
                                                  && y.CurrentUserId != loggedIn
                                                  && y.FriendId == loggedIn) 
                    : -1,
                IsLoggedUser = x.Friend.Id == loggedIn
            })
            .OrderByDescending(x => x.IsFriend)
            .ThenByDescending(x => x.HasRequested)
            .ThenByDescending(x => x.HasReceived)
            .Skip(skip)
            .Take(count)
            .ToList();

        var viewmodel = dtos.Select(x =>
        {
            var model = mapper.Map<ProfileFriendViewModel>(x);
            model.ProfileImage = blobService
                .GetBlobUrl(x.ProfileImageName, GlobalConstants.BlobPictures);
            return model;
        }).ToList();

        return viewmodel; 
    }

    public async Task<int> GetUserFriendsCountAsync(string userId)
    {
        return await userFriendRepository
            .All()
            .Include(x => x.CurrentUser)
            .CountAsync(x => x.CurrentUser.UserName == userId && x.IsFriend);
    }

    public async Task<List<SidebarFriendRecommendationViewModel>> GetFriendRecommendationsAsync(string userId)
    {
        var user = await userRepository.All()
            .Include(x => x.Friends)
            .Include(x => x.RemoveSuggestionFriends)
            .FirstOrDefaultAsync(x => x.Id == userId);

        const int takeFriendsCount = 6;
        
        var recommendations = await userRepository
            .All()
            .Where(x =>
                x.Id != userId
                && x.BlockedUserSuggestions.All(y => y.UserId != userId)
                && ((x.Latitude < user.Latitude && x.Latitude + 5 > user.Latitude) || (x.Latitude - 5 < user.Latitude && x.Latitude > user.Latitude))
                && ((x.Longitude < user.Longitude && x.Longitude + 5 > user.Longitude) || (x.Longitude - 5 < user.Longitude && x.Longitude > user.Longitude))
                && x.Friends.All(y => y.CurrentUserId != userId && y.FriendId != userId) 
                )
            .Take(takeFriendsCount)
            .OrderByDescending(x => x.Interests.Count(y => user.Interests.Select(z => z.Id).Contains(y.Id)) * 0.5 
                                    + x.Friends.Where(x => x.IsFriend).Count(y => y.FriendId == userId || y.CurrentUserId == userId) * 0.1 
                                    + (int)((-x.Friends.Count(y => y.IsFriend)-x.Interests.Count)*0.2) 
                                    + (int)((x.Friends.Count(y => y.IsFriend) + x.Interests.Count) * 0.2))
            .Select(x => new FriendRecommendationDto
            {
                Name = x.FirstName + " " + x.LastName,
                Username = x.UserName,
                CommonInterests = x.Interests.Count(y => user.Interests.Select(z => z.Id).Contains(y.Id)),
                MutualFriends = x.Friends.Where(x => x.IsFriend).Count(y => user.Friends.Select(z => z.FriendId).Contains(y.FriendId)),
                ProfilePhotoName = x.ProfileImage.Id + x.ProfileImage.ImageExtension
            })
            .ToListAsync();

        if(recommendations.Count < takeFriendsCount)
        {
            recommendations.AddRange(await userRepository
                .All()
                .Where(x =>
                    x.Id != user.Id
                    && x.BlockedUserSuggestions.All(y => y.UserId != userId)
                    && x.Friends.All(y => y.CurrentUserId != userId && y.FriendId != userId))
                .Where(x => !recommendations.Select(y => y.Username).Contains(x.UserName))
                .Take(takeFriendsCount - recommendations.Count)
                .OrderByDescending(x => x.Interests.Count(y => user.Interests.Select(z => z.Id).Contains(y.Id)) * 0.5
                                        + x.Friends.Where(x => x.IsFriend).Count(y => y.FriendId == userId || y.CurrentUserId == userId) * 0.1
                                        + (int)((-x.Friends.Count(y => y.IsFriend) - x.Interests.Count) * 0.2)
                                        + (int)((x.Friends.Count(y => y.IsFriend) + x.Interests.Count) * 0.2))
                .Select(x => new FriendRecommendationDto
                {
                    Name = x.FirstName + " " + x.LastName,
                    Username = x.UserName,
                    CommonInterests = x.Interests.Count(y => user.Interests.Select(z => z.Id).Contains(y.Id)),
                    MutualFriends = x.Friends.Where(x => x.IsFriend).Count(y => user.Friends.Select(z => z.FriendId).Contains(y.FriendId)),
                    ProfilePhotoName = x.ProfileImage.Id + x.ProfileImage.ImageExtension
                })
                .ToListAsync());
        }

        var viewModel = recommendations
            .Select(x =>
            {
                var viewModel = mapper.Map<SidebarFriendRecommendationViewModel>(x);
                viewModel.ProfilePhoto = blobService
                    .GetBlobUrl(x.ProfilePhotoName, GlobalConstants.BlobPictures);
                return viewModel;
            })
            .ToList();

        return viewModel;
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