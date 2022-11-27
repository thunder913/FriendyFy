using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

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

        [HttpPost("acceptEvent")]
        public async Task<IActionResult> AcceptEvent(UpdateEventRequestDto dto)
        {
            var user = this.GetUserByToken();
            
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            var result = await this.notificationService.ChangeEventStatusAsync(dto.NotificationId, user, true);
            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost("rejectEvent")]
        public async Task<IActionResult> RejectEvent(UpdateEventRequestDto dto)
        {
            var user = this.GetUserByToken();
            
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            var result = await this.notificationService.ChangeEventStatusAsync(dto.NotificationId, user, false);
            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost("getUnseen")]
        public IActionResult GetUnseenNotifications()
        {
            var user = this.GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            return Ok(this.notificationService.UnseenNotifications(user.Id));
        }

        [HttpPost("seeNotification")]
        public async Task<IActionResult> SeeNotification(SeeNotificationsDto dto)
        {
            var user = this.GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            var result = await this.notificationService.SeeNotificationAsync(user.Id, dto.NotificationId);

            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }
    }
}
