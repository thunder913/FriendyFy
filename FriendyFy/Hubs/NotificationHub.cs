using System.Threading.Tasks;
using FriendyFy.Data.Requests;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.SignalR;

namespace FriendyFy.Hubs;

public class NotificationHub : Hub
{
    private readonly INotificationService notificationService;
    private readonly IUserService userService;

    public NotificationHub(INotificationService notificationService, IUserService userService)
    {
        this.notificationService = notificationService;
        this.userService = userService;
    }
    public async Task<bool> SendEventInviteNotification(EventInvitationRequest dto)
    {
        var userId = Context.UserIdentifier;
            
        var user = await userService.GetByIdAsync(userId);
            
        if (userId == null || userId != user.Id)
        {
            return false;
        }

        var inviteeId = (await userService.GetByUsernameAsync(dto.Username)).Id;

        var notification = await notificationService.CreateNotificationAsync(user, dto.Username, dto.EventId);

        if (notification != null)
        {
            await Clients.User(inviteeId).SendAsync(inviteeId, notification);
        }

        return true;
    }
}