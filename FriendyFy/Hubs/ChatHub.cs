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
        private IChatService chatService { get; set; }
        private IMessageService messageService { get; set; }
        public ChatHub(IChatService chatService, IMessageService messageService)
        {
            this.chatService = chatService;
            this.messageService = messageService;
        }
        public async Task<bool> SendMessage(SendMessageDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                return false;
            }

            var userId = Context.UserIdentifier;

            var messageId = await this.chatService.SendChatMessage(dto.ChatId, userId, dto.Message);

            if (messageId == null)
            {
                return false;
            }

            var usersInChat = this.chatService.GetChatUserIds(dto.ChatId).Where(x => x != userId).ToList();

            var message = this.messageService.GetChatMessageForOtherPeople(messageId);
            if (message == null)
            {
                return false;
            }

            await this.Clients.Users(usersInChat).SendAsync(dto.ChatId, message);

            message.IsYourMessage = true;
            
            await this.Clients.User(userId).SendAsync(dto.ChatId, message);

            return true;
        }
    }
}
