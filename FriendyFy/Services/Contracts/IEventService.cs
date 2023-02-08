using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.ViewModels;

namespace FriendyFy.Services.Contracts;

public interface IEventService
{
    Task CreateEventAsync(string name, DateTime date, List<Interest> interests, PrivacySettings privacySettings, decimal latitude, decimal longitude, string description, string profileImage, string organizerId);
    Task<EventPageViewModel> GetEventByIdAsync(string id, string userId);
    Task<int?> LikeEventAsync(string eventId, ApplicationUser user);
    Task<List<PersonListPopupViewModel>> GetPeopleLikesAsync(string eventId, int take, int skip);
    Task<bool> JoinEventAsync(string eventId, ApplicationUser user);
    Task<bool> CreateEventPostAsync(string eventId, string userId);
    Task<List<NavigationEventViewModel>> GetAttendingEvents(string username);
    Task<List<NavigationEventViewModel>> GetSuggestedEventsAsync(ApplicationUser user);
    Task<List<NavigationEventViewModel>> GetOrganizedEventsAsync(string username);
    Task<string> AddImageToEventAsync(string eventId, string userId, string image);
    Task<bool> LeaveEventAsync(string eventId, string userId);
    Task<bool> DeleteEventAsync(string eventId, string userId);
    Task<List<SearchResultViewModel>> GetEventSearchViewModelAsync(string search, int take, int skip);
    Task<int> RepostEventAsync(string id, string text, string userId);
    List<PersonListPopupViewModel> GetPostReposts(string eventId, int take, int skip);
    Task<bool> DeleteEventPostAsync(string postId, string userId);
    Task<List<PostDetailsViewModel>> GetFeedEventsAsync(ApplicationUser user, bool isProfile, string userName, int take,
        int skip, List<string> ids);
    Task<List<SearchPageResultViewModel>> GetSearchPageEventsAsync(int skip, int take, string searchWord,
        List<int> interestIds, bool showOnlyUserEvents, DateTime eventDate, bool hasDate, string userId);
    Task<string> GetRandomEventIdAsync();
    Task<List<PersonListPopupViewModel>> GetPeopleInviteDtoAsync(string eventId, int take, int skip,
        ApplicationUser user);
}