using FriendyFy.Data;
using System.Collections.Generic;
using ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface IChatService
    {
        List<ChatFooterUserDto> GetUserChats(string userId);
        ChatViewModel GetChatMessages(string userId, string chatId, int take, int skip);
    }
}
