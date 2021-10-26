using Azure.Core;
using FriendyFy.Data;
using FriendyFy.Helpers.Contracts;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IJwtService jwtService;
        private readonly IUserService userService;

        public ChatHub(IJwtService jwtService,
            IUserService userService)
        {
            this.jwtService = jwtService;
            this.userService = userService;
        }
        public async Task SendMessage(SendMessageDto dto)
        {
            await Clients.All.SendAsync("ReceiveMessage", dto.Message);
        }
    }
}
