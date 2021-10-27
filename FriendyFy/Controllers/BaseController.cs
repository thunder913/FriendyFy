using FriendyFy.Helpers;
using FriendyFy.Helpers.Contracts;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace FriendyFy.Controllers
{
    public class BaseController : Controller
    {
        private IJwtService jwtService { get; set; }
        private IUserService userService { get; set; }
        protected IJwtService JwtService => jwtService ?? (jwtService = (IJwtService) HttpContext.RequestServices.GetService(typeof(IJwtService)));
        protected IUserService UserService => userService ?? (userService = (IUserService) HttpContext.RequestServices.GetService(typeof(IUserService)));
        protected ApplicationUser GetUserByToken()
        {
            var jwt = Request.Cookies["jwt"];

            var token = this.JwtService.Verify(jwt);

            var userId = token.Id;

            return this.UserService.GetById(userId);
        }
    }
}
