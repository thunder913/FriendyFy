using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModels;
using ViewModels.ViewModels;

namespace FriendyFy.Services
{
    public class UserService : IUserService
    {
        private readonly IDeletableEntityRepository<ApplicationUser> userRepository;
        private readonly IDeletableEntityRepository<Post> postRepositry;
        private readonly IBlobService blobService;

        public UserService(IDeletableEntityRepository<ApplicationUser> userRepository,
            IDeletableEntityRepository<Post> postRepositry,
            IBlobService blobService)
        {
            this.userRepository = userRepository;
            this.postRepositry = postRepositry;
            this.blobService = blobService;
        }
        public async Task<ApplicationUser> CreateAsync(ApplicationUser user)
        {
            await userRepository.AddAsync(user);
            await userRepository.SaveChangesAsync();

            return user;
        }

        public string GenerateUsername(string firstName, string lastName)
        {
            var rand = new Random();
            var numbers = rand.Next(1, 10);

            var username = new StringBuilder();
            username.Append(firstName);
            username.Append(".");
            username.Append(lastName);
            username.Append(".");

            var number = 0;
            while (numbers > 0)
            {
                number += numbers * rand.Next(0, 10);
                numbers--;
            }

            bool freeName = false;
            while (freeName)
            {
                var currentName = username.ToString() + number;
                if (this.GetByUsername(currentName) == null)
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
            return this.userRepository.All().FirstOrDefault(x => x.Email == email);
        }

        public ApplicationUser GetById(string id)
        {
            return this.userRepository.All()
                .Include(x => x.Friends)
                .Include(x => x.ProfileImage)
                .Include(x => x.CoverImage)
                .FirstOrDefault(x => x.Id == id);
        }

        public ApplicationUser GetByUsername(string username)
        {
            return this.userRepository.All()
                .Include(x => x.Interests)
                .Include(x => x.Friends)
                .Include(x => x.ProfileImage)
                .Include(x => x.CoverImage)
                .FirstOrDefault(x => x.UserName == username && username != null);
        }

        public int GetUserEventsCount(string username)
        {
            return this.userRepository.All().Include(x => x.Events).FirstOrDefault(x => x.UserName == username && username != null).Events.Count();
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

        public List<DisplayImageViewModel> GetUserImages(string username, int take, int skip)
        {
            var images = this.postRepositry
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
                .ToList();

            var toReturn = images.Select(x => new DisplayImageViewModel()
            {
                ImageId = x.ImageId,
                ImageUrl = this.blobService.GetBlobUrlAsync(x.ImageInUrl, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
            }).ToList();

            return toReturn;
        }

        public List<SearchResultViewModel> GetUserSearchViewModel(string search, string userId, int take, int skip)
        {
            var searchWord = search.ToLower();
            var users = this.userRepository
                .AllAsNoTracking()
                .Include(x => x.Interests)
                .Include(x => x.ProfileImage)
                .Where(x => (string.IsNullOrWhiteSpace(search) || (x.FirstName + " " + x.LastName).ToLower().Contains(searchWord)
                //|| x.Interests.Any(y => y.Name.ToLower().Contains(searchWord))
                )
                && x.Id != userId)
                .OrderBy(x => x.UserName)
                .Skip(skip)
                .Take(take)
                .Select(x => new
                {
                    Id = x.UserName,
                    Name = x.FirstName + " " + x.LastName,
                    Image = x.ProfileImage.Id + x.ProfileImage.ImageExtension,
                })
                .ToList();

            var toReturn = users.Select(x => new SearchResultViewModel()
            {
                Id = x.Id,
                ImageUrl = this.blobService.GetBlobUrlAsync(x.Image, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                Name = x.Name,
                Type = SearchResultType.profile.ToString()
            }).ToList();


            return toReturn;
        }

        public List<RightNavigationRecommendationViewModel> GetEventUserRecommendations(string userId)
        {
            var user = this.userRepository.All()
                .Include(x => x.Interests)
                .Include(x => x.RemoveSuggestionFriends)
                .FirstOrDefault(x => x.Id == userId);

            var blocked = user.RemoveSuggestionFriends.Select(y => y.BlockedUserId).ToArray();
            var userInterests = user.Interests.Select(y => y.Id).ToArray();

            return this.userRepository
                .AllAsNoTracking()
                .Include(x => x.Interests)
                .Include(x => x.ProfileImage)
                .Include(x => x.Friends)
                .Where(x => x.Id != userId && !blocked.Any(y => y == x.Id)
                && !(x.Friends.Any(y => y.FriendId == x.Id && y.CurrentUserId == userId) || x.Friends.Any(y => y.CurrentUserId == x.Id && y.FriendId == userId)))
                .OrderByDescending(x => x.Events.Count(y => y.Users.Any(z => z.Id == userId)) + 
                x.Friends.Count(y => y.Id == userId) * 2 +
                x.Interests.Count(y => userInterests.Any(z => z == y.Id)))
                .Take(4)
                .ToList()
                .Select(x => new RightNavigationRecommendationViewModel()
                {
                    CommonInterests = x.Interests.Count(y => user.Interests.Any(z => z.Id == y.Id)),
                    EventsTogether = x.Events.Count(y => y.Users.Any(z => z.Id == userId)),
                    MutualFriends = x.Friends.Count(y => y.Id == userId) * 2,
                    Name = x.FirstName + " " + x.LastName,
                    ProfilePhoto = this.blobService.GetBlobUrlAsync(x.ProfileImage?.Id + x.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    Username = x.UserName
                })
                .ToList();
        }

        public async Task<bool> ChangeUserThemeAsync(ApplicationUser user, ThemePreference theme)
        {
            user.ThemePreference = theme;
            var result = await this.userRepository.SaveChangesAsync();
            return result > 0;
        }
    }
}
