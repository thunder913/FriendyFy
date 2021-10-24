using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using FriendyFy.Data;
using System.Net;
using System.Runtime.Serialization.Json;
using System.IO;

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

            return Ok(new { Location = this.geolocationService.GetUserLocation(Decimal.ToDouble((decimal)user.Latitude), Decimal.ToDouble((decimal)user.Longitude)) });
        }

        [HttpPost("getEventsCount")]
        public IActionResult GetEventsCount([FromBody] string userId)
        {
            var count = this.UserService.GetUserEventsCount(userId);

            return Ok(new { count });
        }
    }
}
