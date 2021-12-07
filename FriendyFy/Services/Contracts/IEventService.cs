using FriendyFy.Models;
using FriendyFy.Models.Enums;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ViewModels;
using ViewModels.ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface IEventService
    {
        Task CreateEventAsync(string name, DateTime date, List<Interest> interests, PrivacySettings privacySettings, decimal latitude, decimal longitude, string description, string profileImage, string organizerId);
        Task<EventPageViewModel> GetEventByIdAsync(string id, string userId);
        List<PostDetailsViewModel> GetEvents(string userId);
        Task<int?> LikeEventAsync(string eventId, ApplicationUser user);
        List<PersonListPopupViewModel> GetPeopleLikes(string eventId, int take, int skip);
        Task<bool> JoinEventAsync(string eventId, ApplicationUser user);
        Task<bool> CreateEventPostAsync(string eventId, string userId);
        List<NavigationEventViewModel> GetAttendingEvents(string username);
        List<NavigationEventViewModel> GetSuggestedEvents(ApplicationUser user);
        List<NavigationEventViewModel> GetOrganizedEvents(string username);
        Task<string> AddImageToEventAsync(string eventId, string userId, string image);
        Task<bool> LeaveEventAsync(string eventId, string userId);
        Task<bool> DeleteEventAsync(string eventId, string userId);
        List<SearchResultViewModel> GetEventSearchViewModel(string search, int take, int skip);
        Task<bool> RepostEventAsync(string id, string text, string userId);
        List<PersonListPopupViewModel> GetPostReposts(string eventId, int take, int skip);
        Task<bool> DeleteEventPostAsync(string postId, string userId);
        List<PostDetailsViewModel> GetFeedEvents(ApplicationUser user, bool isProfile, string userName, int take, int skip, List<string> ids);
    }
}
