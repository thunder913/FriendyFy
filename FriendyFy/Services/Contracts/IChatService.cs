﻿using System.Collections.Generic;
using System.Threading.Tasks;
using FriendyFy.Data.Dtos;
using FriendyFy.Models;
using FriendyFy.ViewModels;

namespace FriendyFy.Services.Contracts;

public interface IChatService
{
    Task<List<ChatFooterUserDto>> GetUserChatsAsync(string userId, int page, int itemsPerPage, int take, string search,
        List<string> chatIds);
    Task<ChatViewModel> GetChatMessagesAsync(string userId, string chatId, int take, int skip);
    Task<ChatMessageViewModel> SendChatMessage(string chatId, string userId, string message);
    List<string> GetChatUserIds(string chatId);
    Task<bool> SeeMessagesAsync(string chatId, ApplicationUser user);
}