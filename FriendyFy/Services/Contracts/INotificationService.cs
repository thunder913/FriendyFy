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
    }
}
