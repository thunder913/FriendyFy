using FriendyFy.Models;
using FriendyFy.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ViewModels.ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface IUserService
    {
        Task<ApplicationUser> CreateAsync(ApplicationUser user);

        ApplicationUser GetByEmail(string email);

        ApplicationUser GetById(string id);

        string GenerateUsername(string firstName, string lastName);

        ApplicationUser GetByUsername(string username);
        Task SetUserFirstTimeLoginAsync(ApplicationUser user, Image profileImage, Image coverImage, string quote, List<Interest> interests, decimal? longitude, decimal? latitude);
        int GetUserEventsCount(string username);
        List<DisplayImageViewModel> GetUserImages(string username, int take, int skip);
        List<SearchResultViewModel> GetUserSearchViewModel(string search, string userId, int take, int skip);
        List<RightNavigationRecommendationViewModel> GetEventUserRecommendations(string userId);
        Task<bool> ChangeUserThemeAsync(ApplicationUser user, ThemePreference theme);
        UserDataViewModel GetUserData(ApplicationUser user);

        Task ChangeUserDataAsync(ApplicationUser user, string firstName, string lastName,
           DateTime birthday, bool hasNewProfileImage, bool hasNewCoverImage, string description,
           List<Interest> interests, decimal? longitude, decimal? latitude, string newProfilePicture = null, string newCoverImage = null);
    }
}
