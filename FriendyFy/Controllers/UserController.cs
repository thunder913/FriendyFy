using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using FriendyFy.Data;
using System.Net;
using System.Runtime.Serialization.Json;
using System.IO;
using FriendyFy.Models.Enums;
using System.Globalization;

namespace FriendyFy.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : BaseController
    {
        private IUserService userService { get; set; }
        private IGeolocationService geolocationService { get; set; }

        public UserController(IGeolocationService geolocationService, IUserService userService)
        {
            this.geolocationService = geolocationService;
            this.userService = userService;
        }

        [HttpPost("getLocation")]
        public IActionResult GetLocation([FromBody] string userId)
        {
            var user = this.UserService.GetByUsername(userId);

            if (user?.Longitude == null || user?.Latitude == null)
            {
                return BadRequest("The user hasn't set his location!");
            }

            return Ok(new { Location = this.geolocationService.GetUserLocation(Decimal.ToDouble((decimal)user.Latitude), Decimal.ToDouble((decimal)user.Longitude)), Latitude = user.Latitude, Longitude = user.Longitude });
        }

        [HttpPost("getEventsCount")]
        public IActionResult GetEventsCount([FromBody] string userId)
        {
            var count = this.UserService.GetUserEventsCount(userId);

            return Ok(new { count });
        }

        [HttpPost("changeTheme")]
        public async Task<IActionResult> ChangerUserTheme(ChangeUserThemeDto dto)
        {
            TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
            var user = this.GetUserByToken();
            if (user.UserName != dto.Username)
            {
                return Unauthorized("You are trying to impersonate a user!");
            }

            var parsed = Enum.TryParse(ti.ToTitleCase(dto.Theme), out ThemePreference theme);
            
            if (!parsed)
            {
                return BadRequest("There was an error switching the theme!");
            }

            var result = await this.userService.ChangeUserThemeAsync(user, theme);
            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }
    }
}
