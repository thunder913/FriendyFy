using System.Threading.Tasks;
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
            var user = GetUserByToken();
            
            if (user == null || dto.UserId != user.Id)
            {
                return Unauthorized("You are not logged in!");
            }

            return Ok(notificationService.GetNotificationsForUser(dto.UserId, dto.Take, dto.Skip));
        }

        [HttpPost("acceptEvent")]
        public async Task<IActionResult> AcceptEvent(UpdateEventRequestDto dto)
        {
            var user = GetUserByToken();
            
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            var result = await notificationService.ChangeEventStatusAsync(dto.NotificationId, user, true);
            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost("rejectEvent")]
        public async Task<IActionResult> RejectEvent(UpdateEventRequestDto dto)
        {
            var user = GetUserByToken();
            
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            var result = await notificationService.ChangeEventStatusAsync(dto.NotificationId, user, false);
            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost("getUnseen")]
        public IActionResult GetUnseenNotifications()
        {
            var user = GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            return Ok(notificationService.UnseenNotifications(user.Id));
        }

        [HttpPost("seeNotification")]
        public async Task<IActionResult> SeeNotification(SeeNotificationsDto dto)
        {
            var user = GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            var result = await notificationService.SeeNotificationAsync(user.Id, dto.NotificationId);

            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }
    }
}
