using System;
using System.Globalization;
using System.Threading.Tasks;
using FriendyFy.Data.Requests;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using static System.Decimal;

namespace FriendyFy.Controllers;

[ApiController]
[Route("user")]
public class UserController : BaseController
{
    private IUserService userService { get; }
    private IGeolocationService geolocationService { get; }

    public UserController(IGeolocationService geolocationService, IUserService userService)
    {
        this.geolocationService = geolocationService;
        this.userService = userService;
    }

    [HttpPost("getLocation")]
    public IActionResult GetLocation([FromBody] string userId)
    {
        var user = UserService.GetByUsername(userId);

        if (user?.Longitude == null || user?.Latitude == null)
        {
            return BadRequest("The user hasn't set his location!");
        }

        return Ok(new { Location = geolocationService.GetUserLocation(ToDouble((decimal)user.Latitude), ToDouble((decimal)user.Longitude)), user.Latitude, user.Longitude });
    }

    [HttpPost("getEventsCount")]
    public IActionResult GetEventsCount([FromBody] string userId)
    {
        var count = UserService.GetUserEventsCount(userId);

        return Ok(new { count });
    }

    [HttpPost("changeTheme")]
    public async Task<IActionResult> ChangerUserTheme(ChangeUserThemeRequest dto)
    {
        var user = GetUserByToken();
            
        if (user.UserName != dto.Username)
        {
            return Unauthorized("You are trying to impersonate a user!");
        }

        var parsed = Enum.TryParse(CultureInfo.CurrentCulture.TextInfo.ToTitleCase(dto.Theme), out ThemePreference theme);
            
        if (!parsed)
        {
            return BadRequest("There was an error switching the theme!");
        }

        var result = await userService.ChangeUserThemeAsync(user, theme);
        if (result)
        {
            return Ok();
        }

        return BadRequest();
    }
}