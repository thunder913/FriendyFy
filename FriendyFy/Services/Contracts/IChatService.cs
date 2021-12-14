using FriendyFy.Data;
using FriendyFy.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface IChatService
    {
        List<ChatFooterUserDto> GetUserChats(string userId, int page, int itemsPerPage, int take, string search);
        ChatViewModel GetChatMessages(string userId, string chatId, int take, int skip);
        Task<string> SendChatMessage(string chatId, string userId, string message);
        List<string> GetChatUserIds(string chatId);
        Task<bool> SeeMessagesAsync(string chatId, ApplicationUser user);
    }
}
