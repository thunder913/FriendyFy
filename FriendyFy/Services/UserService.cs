using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
using ViewModels.ViewModels;

namespace FriendyFy.Services;

public class UserService : IUserService
{
    private readonly IDeletableEntityRepository<ApplicationUser> userRepository;
    private readonly IDeletableEntityRepository<Post> postRepository;
    private readonly IBlobService blobService;
    private readonly IImageService imageService;
    private readonly IMapper mapper;

    public UserService(IDeletableEntityRepository<ApplicationUser> userRepository,
        IDeletableEntityRepository<Post> postRepository,
        IBlobService blobService,
        IImageService imageService)
    {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.blobService = blobService;
        this.imageService = imageService;
        mapper = AutoMapperConfig.MapperInstance;
    }
    public async Task<ApplicationUser> CreateAsync(ApplicationUser user)
    {
        userRepository.Add(user);
        await userRepository.SaveChangesAsync();

        return user;
    }

    public string GenerateUsername(string firstName, string lastName)
    {
        var rand = new Random();
        var numbers = rand.Next(1, 10);

        var username = new StringBuilder()
            .Append(firstName)
            .Append(".")
            .Append(lastName)
            .Append(".");

        var number = 0;
        while (numbers > 0)
        {
            number += numbers * rand.Next(0, 10);
            numbers--;
        }

        while (true)
        {
            var currentName = username.ToString() + number;
            var user = userRepository.All().FirstOrDefault(x => x.UserName == currentName);
            if (user == null)
            {
                break;
            }
            number++;
        }
        username.Append(number);

        return username.ToString();
    }

    public ApplicationUser GetByEmail(string email)
    {
        return userRepository.All().FirstOrDefault(x => x.Email == email);
    }

    public async Task<ApplicationUser> GetByIdAsync(string id)
    {
        return await userRepository.All()
            .Include(x => x.Friends)
            .Include(x => x.ProfileImage)
            .Include(x => x.CoverImage)
            .Include(x => x.Interests)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<ApplicationUser> GetByUsernameAsync(string username)
    {
        return await userRepository.All()
            .Include(x => x.Interests)
            .Include(x => x.Friends)
            .Include(x => x.ProfileImage)
            .Include(x => x.CoverImage)
            .FirstOrDefaultAsync(x => x.UserName == username && username != null);
    }

    public async Task<int> GetUserEventsCountAsync(string username)
    {
        return (await userRepository.All()
            .Include(x => x.Events)
            .Include(x => x.EventsOrganized)
            .FirstOrDefaultAsync(x => x.UserName == username && username != null))
            .Events
            .Count(x => x.Time < DateTime.UtcNow);
    }

    public async Task SetUserFirstTimeLoginAsync(ApplicationUser user, Image profileImage, Image coverImage, string quote, List<Interest> interests, decimal? longitude, decimal? latitude)
    {
        user.ProfileImage = profileImage;
        user.CoverImage = coverImage;
        user.Photos.Add(profileImage);
        user.Photos.Add(coverImage);
        user.Quote = quote;
        user.Interests = interests;
        user.Longitude = longitude;
        user.Latitude = latitude;
        user.FinishedFirstTimeLogin = true;

        await userRepository.SaveChangesAsync();
    }

    public async Task<List<DisplayImageViewModel>> GetUserImagesAsync(string username, int take, int skip)
    {
        var images = await postRepository
            .AllAsNoTracking()
            .Include(x => x.Creator)
            .Include(x => x.Image)
            .Where(x => x.Creator.UserName == username && x.Image != null)
            .OrderByDescending(x => x.CreatedOn)
            .Skip(skip)
            .Take(take)
            .Select(x => new
            {
                ImageId = x.Image.Id,
                ImageInUrl = x.Image.Id + x.Image.ImageExtension
            })
            .ToListAsync();

        var toReturn = images.Select(x => new DisplayImageViewModel
        {
            ImageId = x.ImageId,
            ImageUrl = blobService.GetBlobUrl(x.ImageInUrl, GlobalConstants.BlobPictures),
        }).ToList();

        return toReturn;
    }

    public async Task<List<SearchResultViewModel>> GetUserSearchViewModelAsync(string search, string userId, int take, int skip)
    {
        var searchWord = search.ToLower();
        var users = await userRepository.AllAsNoTracking()
            .Where(x => (string.IsNullOrWhiteSpace(search) || (x.FirstName + " " + x.LastName).ToLower().Contains(searchWord)) && x.Id != userId)
            .Where(x => x.FinishedFirstTimeLogin)
            .OrderBy(x => x.UserName)
            .Skip(skip)
            .Take(take)
            .Select(x => new
            {
                Id = x.UserName,
                Name = x.FirstName + " " + x.LastName,
                Image = x.ProfileImage.Id + x.ProfileImage.ImageExtension,
            })
            .ToListAsync();

        var toReturn = users.Select(x => new SearchResultViewModel
        {
            Id = x.Id,
            ImageUrl = blobService.GetBlobUrl(x.Image, GlobalConstants.BlobPictures),
            Name = x.Name,
            Type = SearchResultType.profile.ToString()
        }).ToList();


        return toReturn;
    }

    public async Task<List<RightNavigationRecommendationViewModel>> GetEventUserRecommendationsAsync(string userId)
    {
        var user = await userRepository.All()
            .Include(x => x.Interests)
            .Include(x => x.RemoveSuggestionFriends)
            .FirstOrDefaultAsync(x => x.Id == userId);

        var blocked = user.RemoveSuggestionFriends.Select(y => y.BlockedUserId).ToArray();
        var userInterests = user.Interests.Select(y => y.Id).ToArray();

        const int usersToTake = 4;
        var users = await userRepository
            .AllAsNoTracking()
            .Where(x => x.Id != userId && blocked.All(y => y != x.Id)
                                       && !(x.Friends.Any(y => y.FriendId == x.Id && y.CurrentUserId == userId) 
                                            || x.Friends.Any(y => y.CurrentUserId == x.Id && y.FriendId == userId)))
            .OrderByDescending(x => x.Events.Where(x => x.Time < DateTime.UtcNow).Count(y => y.Users.Any(z => z.Id == userId)) +
                                    x.Friends.Where(x => x.IsFriend).Count(y => y.Id == userId) * 2 +
                                    x.Interests.Count(y => userInterests.Any(z => z == y.Id)))
            .Take(usersToTake)
            .Select(x => new RightNavigationRecommendationViewModel
            {
                EventsTogether = x.Events.Where(x => x.Time < DateTime.UtcNow).Count(y => y.Users.Any(z => z.Id == userId)),
                Name = x.FirstName + " " + x.LastName,
                ProfilePhoto = x.ProfileImage.Id + x.ProfileImage.ImageExtension,
                Username = x.UserName
            })
            .ToListAsync();

        return users.Select(x => new RightNavigationRecommendationViewModel
        {
            EventsTogether = x.EventsTogether,
            Name = x.Name,
            ProfilePhoto = blobService.GetBlobUrl(x.ProfilePhoto, GlobalConstants.BlobPictures),
            Username = x.Username
        }).ToList();
    }

    public async Task<bool> ChangeUserThemeAsync(ApplicationUser user, ThemePreference theme)
    {
        user.ThemePreference = theme;
        var result = await userRepository.SaveChangesAsync();
        return result > 0;
    }

    public async Task<UserDataViewModel> GetUserDataAsync(string userId)
    {
        var dto = await userRepository
            .AllAsNoTracking()
            .Where(x => x.Id == userId)
            .Include(x => x.Interests)
            .Include(x => x.ProfileImage)
            .Include(x => x.CoverImage)
            .Select(x => new UserDataDto
            {
                Birthday = x.BirthDate.ToString("MM/dd/yyyy"),
                FirstName = x.FirstName,
                LastName = x.LastName,
                Interests = x.Interests.Select(y => new InterestViewModel
                {
                    Id = y.Id,
                    Label = y.Name,
                }).ToList(),
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                Quote = x.Quote,
                ProfilePhotoName = x.ProfileImage.Id + x.ProfileImage.ImageExtension,
                CoverPhotoName = x.CoverImage.Id + x.CoverImage.ImageExtension,
            })
            .FirstOrDefaultAsync();

        var viewmodel = mapper.Map<UserDataViewModel>(dto);
        viewmodel.ProfilePhoto = blobService.GetBlobUrl(dto.ProfilePhotoName, GlobalConstants.BlobPictures);
        viewmodel.CoverPhoto = blobService.GetBlobUrl(dto.CoverPhotoName, GlobalConstants.BlobPictures);

        return viewmodel;
    }

    public async Task ChangeUserDataAsync(ApplicationUser user, string firstName, string lastName,
        DateTime birthday, bool hasNewProfileImage, bool hasNewCoverImage, string description,
        List<Interest> interests, decimal? longitude, decimal? latitude, string newProfilePicture = null, string newCoverImage = null)
    {
        user.FirstName = firstName;
        user.LastName = lastName;
        user.Quote = description;
        user.BirthDate = birthday;
        user.Quote = description;
        user.Interests = interests;
        user.Longitude = longitude;
        user.Latitude = latitude;

        if (hasNewProfileImage)
        {
            await blobService.DeleteBlobAsync(user.ProfileImage.Id + user.ProfileImage.ImageExtension, GlobalConstants.BlobPictures);
            var profileImage = await imageService.AddImageAsync(ImageType.ProfileImage);
            await blobService.UploadBase64StringAsync(newProfilePicture, profileImage.Id + profileImage.ImageExtension, GlobalConstants.BlobPictures);
            user.ProfileImage = profileImage;
        }

        if (hasNewCoverImage)
        {
            await blobService.DeleteBlobAsync(user.CoverImage.Id + user.CoverImage.ImageExtension, GlobalConstants.BlobPictures);
            var coverImage = await imageService.AddImageAsync(ImageType.ProfileImage);
            await blobService.UploadBase64StringAsync(newCoverImage, coverImage.Id + coverImage.ImageExtension, GlobalConstants.BlobPictures);
            user.CoverImage = coverImage;
        }

        await userRepository.SaveChangesAsync();
    }

    public async Task<bool> ResetPassword(ApplicationUser user, string newPasswordHash)
    {
        user.PasswordHash = newPasswordHash;
        var result = await userRepository.SaveChangesAsync();
        return result > 0;
    }

    public async Task<List<SearchPageResultViewModel>> GetSearchPageUsersAsync(int take, int skip, string searchWord, List<int> interestIds, string userId)
    {
        searchWord = searchWord.ToLower();
        var users = await userRepository
            .AllAsNoTracking()
            .Where(x => (string.IsNullOrWhiteSpace(searchWord) || (x.FirstName + " " + x.LastName).ToLower().Contains(searchWord)))
            .Where(x => (interestIds.Count == 0) || (x.Interests.Count(y => interestIds.Contains(y.Id)) == interestIds.Count()))
            .Where(x => x.Id != userId)
            .Where(x => x.FinishedFirstTimeLogin)
            .OrderBy(x => x.UserName)
            .Skip(skip)
            .Take(take)
            .Select(x => new
            {
                Id = x.UserName,
                Name = x.FirstName + " " + x.LastName,
                Image = x.ProfileImage.Id + x.ProfileImage.ImageExtension,
                MutualFriends = x.Friends.Where(x => x.IsFriend).Count(y => y.Friend.Friends.Any(z => z.IsFriend && z.FriendId == userId)),
            })
            .ToListAsync();

        var toReturn = users.Select(x => new SearchPageResultViewModel
        {
            Id = x.Id,
            ImageUrl = blobService.GetBlobUrl(x.Image, GlobalConstants.BlobPictures),
            Name = x.Name,
            Type = SearchResultType.profile.ToString(),
            MutualFriends = x.MutualFriends,
        }).ToList();

        return toReturn;
    }

    public async Task<List<PersonListPopupViewModel>> GetInvitePeoplePopUpAsync(List<string> userIds)
    {
        var users = await userRepository
            .AllAsNoTracking()
            .Where(x => userIds.Any(y => y == x.Id))
            .Select(x => new PersonListPopupViewModel
            {
                Name = x.FirstName + " " + x.LastName,
                ProfileImage = x.ProfileImage.Id + x.ProfileImage.ImageExtension,
                Username = x.UserName,
            }).ToListAsync();

        return users.Select(x => new PersonListPopupViewModel
        {
            Name = x.Name,
            Username = x.Username,
            ProfileImage = blobService.GetBlobUrl(x.ProfileImage, GlobalConstants.BlobPictures)
        }).ToList();
    }
}