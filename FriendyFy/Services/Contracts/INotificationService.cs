using FriendyFy.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using ViewModels.ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface INotificationService
    {
        Task<NotificationViewModel> CreateNotificationAsync(ApplicationUser inviter, string inviteeUsername, string eventId);
        List<NotificationViewModel> GetNotificationsForUser(string userId, int take, int skip);
        Task<bool> ChangeEventStatusAsync(string notificationId, ApplicationUser user, bool joinEvent);
        int UnseenNotifications(string userId);
        Task<bool> SeeNotificationAsync(string userId, string notificationId);
        Task<NotificationViewModel> CreateFriendRequestNotification(ApplicationUser inviter, string inviteeId);
        Task<bool> ChangeUserFriendNotificationStatus(string inviterId, string inviteeId);
    }
}
