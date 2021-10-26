using FriendyFy.Data;
using System.Collections.Generic;

namespace FriendyFy.Services.Contracts
{
    public interface IChatService
    {
        List<ChatFooterUserDto> GetUserChats(string userId);
    }
}
