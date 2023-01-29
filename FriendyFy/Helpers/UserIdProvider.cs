using FriendyFy.Helpers.Contracts;
using Microsoft.AspNetCore.SignalR;

namespace FriendyFy.Helpers
{
    public class UserIdProvider : IUserIdProvider
    {
        private IJwtService jwtService { get; set; }

        public UserIdProvider(IJwtService jwtService)
        {
            this.jwtService = jwtService;
        }

        public string GetUserId(HubConnectionContext connection)
        {
            var jwt = connection.GetHttpContext().Request.Cookies["jwt"]; 
            var token = jwtService.Verify(jwt);
            var userId = token.Id;
            return userId;
        }
    }
}
