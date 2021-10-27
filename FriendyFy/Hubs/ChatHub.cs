using Azure.Core;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Helpers.Contracts;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Hubs
{
    public class ChatHub : Hub
    {
        private IJwtService jwtService { get; set; }
        private IChatService chatService { get; set; }
        private IMessageService messageService { get; set; }
        public ChatHub(IJwtService jwtService, IChatService chatService, IMessageService messageService)
        {
            this.jwtService = jwtService;
            this.chatService = chatService;
            this.messageService = messageService;
        }

        //public override Task OnConnectedAsync()
        //{
        //    var jwtToken = Context.Features.Get<IHttpContextFeature>().HttpContext.Request.Cookies["jwt"];
        //    var token = this.jwtService.Verify(jwtToken);
        //    var userId = token.Issuer;
        //    Groups.AddToGroupAsync(Context.ConnectionId, userId).GetAwaiter().GetResult();
        //    return base.OnConnectedAsync();
        //}
        public async Task<bool> SendMessage(SendMessageDto dto)
        {
            var userId = Context.UserIdentifier;

            var messageId = await this.chatService.SendChatMessage(dto.ChatId, userId, dto.Message);

            if (messageId == null)
            {
                return false;
            }

            var usersInChat = this.chatService.GetChatUserIds(dto.ChatId).Where(x => x != userId).ToList();

            var messageForOtherPeople = this.messageService.GetChatMessageForOtherPeople(messageId);
            if (messageForOtherPeople == null)
            {
                return false;
            }

            await this.Clients.Users(usersInChat).SendAsync("ReceiveMessage", messageForOtherPeople);

            return true;
        }
    }
}
