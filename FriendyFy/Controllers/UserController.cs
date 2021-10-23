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

            return Content(this.geolocationService.GetUserLocation(Decimal.ToDouble((decimal)user.Latitude), Decimal.ToDouble((decimal)user.Longitude)));
        }

        public static RootObject getAddress(double lat, double lon)
        {
            WebClient webClient = new WebClient();
            webClient.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; .NET CLR 1.0.3705;)");
            webClient.Headers.Add("Referer", "http://www.microsoft.com");
            var jsonData = webClient.DownloadData("http://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lon);
            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(RootObject));
            RootObject rootObject = (RootObject)ser.ReadObject(new MemoryStream(jsonData));
            return rootObject;
        }
    }
}
