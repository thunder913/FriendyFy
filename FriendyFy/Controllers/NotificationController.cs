using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace FriendyFy.Controllers
{
    [Route("notification")]
    [ApiController]
    public class NotificationController : BaseController
    {
        private readonly INotificationService notificationService;

        public NotificationController(INotificationService notificationService)
        {
            this.notificationService = notificationService;
        }
        [HttpPost("getForUser")]
        public IActionResult GetNotification(GetNotificationsDto dto)
        {
            var user = this.GetUserByToken();
            if (user == null || dto.UserId != user.Id)
            {
                return Unauthorized("You are not logged in!");
            }

            return Ok(this.notificationService.GetNotificationsForUser(dto.UserId, dto.Take, dto.Skip));
        }
    }
}
