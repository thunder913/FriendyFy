using FriendyFy.Helpers.Contracts;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace FriendyFy.Controllers;

public class BaseController : Controller
{
    private IJwtService jwtService { get; set; }
    private IUserService userService { get; set; }
    protected IJwtService JwtService => jwtService ??= (IJwtService) HttpContext.RequestServices.GetService(typeof(IJwtService));
    protected IUserService UserService => userService ??= (IUserService) HttpContext.RequestServices.GetService(typeof(IUserService));
    protected ApplicationUser GetUserByToken()
    {
        var jwt = Request.Cookies["jwt"];
        if (jwt == null)
        {
            return null;
        }
            
        var token = JwtService.Verify(jwt);

        var userId = token.Id;

        return UserService.GetById(userId);
    }
}