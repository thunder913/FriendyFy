﻿using FriendyFy.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface IChatService
    {
        List<ChatFooterUserDto> GetUserChats(string userId);
        ChatViewModel GetChatMessages(string userId, string chatId, int take, int skip);
        Task<string> SendChatMessage(string chatId, string userId, string message);
        List<string> GetChatUserIds(string chatId);
    }
}