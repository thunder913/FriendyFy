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
        Task CreateEventAsync(string name, DateTime date, List<Interest> interests, PrivacySettings privacySettings, decimal latitude, decimal longitude, bool isReocurring, ReocurringType reocurringType, string description, string profileImage, string organizerId);
        Task<EventPageViewModel> GetEventByIdAsync(string id, string userId);
        List<PostDetailsViewModel> GetEvents(string userId);
        Task<int?> LikeEventAsync(string eventId, ApplicationUser user);
        List<PersonListPopupViewModel> GetPeopleLikes(string eventId, int take, int skip);
        Task<bool> JoinEventAsync(string eventId, ApplicationUser user);
        Task<bool> CreateEventPostAsync(string eventId, string userId);
    }
}
