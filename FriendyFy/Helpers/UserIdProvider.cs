using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace FriendyFy.Helpers
{
    public class UserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.Identity?.Name;
        }
    }
}
