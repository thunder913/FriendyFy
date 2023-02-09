using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.ViewModels;

namespace FriendyFy.Services.Contracts;

public interface IUserService
{
    Task<ApplicationUser> CreateAsync(ApplicationUser user);

    ApplicationUser GetByEmail(string email);

    Task<ApplicationUser> GetByIdAsync(string id);

    string GenerateUsername(string firstName, string lastName);

    Task<ApplicationUser> GetByUsernameAsync(string username);
    Task SetUserFirstTimeLoginAsync(ApplicationUser user, Image profileImage, Image coverImage, string quote, List<Interest> interests, decimal? longitude, decimal? latitude);
    Task<int> GetUserEventsCountAsync(string username);
    Task<List<DisplayImageViewModel>> GetUserImagesAsync(string username, int take, int skip);
    Task<List<SearchResultViewModel>> GetUserSearchViewModelAsync(string search, string userId, int take, int skip);
    Task<List<RightNavigationRecommendationViewModel>> GetEventUserRecommendationsAsync(string userId);
    Task<bool> ChangeUserThemeAsync(ApplicationUser user, ThemePreference theme);
    Task<UserDataViewModel> GetUserDataAsync(string userId);

    Task ChangeUserDataAsync(ApplicationUser user, string firstName, string lastName,
        DateTime birthday, bool hasNewProfileImage, bool hasNewCoverImage, string description,
        List<Interest> interests, decimal? longitude, decimal? latitude, string newProfilePicture = null, string newCoverImage = null);
    Task<bool> ResetPassword(ApplicationUser user, string newPasswordHash);
    Task<List<SearchPageResultViewModel>> GetSearchPageUsersAsync(int take, int skip, string searchWord, List<int> interestIds, string userId);
    Task<List<PersonListPopupViewModel>> GetInvitePeoplePopUpAsync(List<string> userIds);
}