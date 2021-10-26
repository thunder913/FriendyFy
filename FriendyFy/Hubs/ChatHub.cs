using Azure.Core;
using FriendyFy.Data;
using FriendyFy.Helpers.Contracts;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Hubs
{
    public class ChatHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            var name = Context.User.Identity.Name;
            var user1 = Context.User.Identity.Name;
            Clients.User(Context.User.Identity.Name);
            return base.OnConnectedAsync();
        }
        public async Task SendMessage(SendMessageDto dto)
        {
            var user = Context.User.Identity.Name;
            await Clients.All.SendAsync("ReceiveMessage", dto.Message);
        }
    }
}
