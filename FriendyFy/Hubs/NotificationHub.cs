using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ViewModels.ViewModels;

namespace FriendyFy.Hubs
{
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
        public async Task<bool> SendEventInviteNotification(InviteUserDto dto)
        {
            var userId = Context.UserIdentifier;
            var user = this.userService.GetById(userId);
            if (userId == null || userId != user.Id)
            {
                return false;
            }

            var inviteeId = this.userService.GetByUsername(dto.Username).Id;

            var notification = await this.notificationService.CreateNotificationAsync(user, dto.Username, dto.EventId);

            if (notification != null)
            {
                await this.Clients.User(inviteeId).SendAsync(inviteeId, notification);
            }

            return true;
        }
    }
}
