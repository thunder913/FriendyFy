using System.Threading.Tasks;
using FriendyFy.Data.Requests;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.SignalR;

namespace FriendyFy.Hubs;

public class NotificationHub : Hub
{
    private readonly IEventService eventService;
    private readonly INotificationService notificationService;
    private readonly IUserService userService;

    public NotificationHub(IEventService eventService, INotificationService notificationService, IUserService userService)
    {
        this.eventService = eventService;
        this.notificationService = notificationService;
        this.userService = userService;
    }
    public async Task<bool> SendEventInviteNotification(EventInvitationRequest dto)
    {
        var userId = Context.UserIdentifier;
            
        var user = userService.GetById(userId);
            
        if (userId == null || userId != user.Id)
        {
            return false;
        }

        var inviteeId = userService.GetByUsername(dto.Username).Id;

        var notification = await notificationService.CreateNotificationAsync(user, dto.Username, dto.EventId);

        if (notification != null)
        {
            await Clients.User(inviteeId).SendAsync(inviteeId, notification);
        }

        return true;
    }
}