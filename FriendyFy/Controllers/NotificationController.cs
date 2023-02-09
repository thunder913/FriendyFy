using System.Threading.Tasks;
using FriendyFy.Data.Requests;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace FriendyFy.Controllers;

[Route("notification")]
[ApiController]
public class NotificationController : BaseController
{
    private readonly INotificationService notificationService;

    public NotificationController(INotificationService notificationService)
    {
        this.notificationService = notificationService;
    }

    [HttpGet("user")]
    public async Task<IActionResult> GetNotification([FromQuery] NotificationRequest dto)
    {
        var userId = GetUserIdByToken();

        if (string.IsNullOrWhiteSpace(userId) || dto.UserId != userId)
        {
            return Unauthorized("You are not logged in!");
        }

        return Ok(await notificationService.GetNotificationsForUserAsync(dto.UserId, dto.Take, dto.Skip));
    }

    [HttpPost("accept/event")]
    public async Task<IActionResult> AcceptEvent(NotificationIdRequest dto)
    {
        var user = await GetUserByToken();
            
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

    [HttpPost("reject/event")]
    public async Task<IActionResult> RejectEvent(NotificationIdRequest dto)
    {
        var user = await GetUserByToken();
            
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

    [HttpGet("unseen")]
    public async Task<IActionResult> GetUnseenNotifications()
    {
        var userId = GetUserIdByToken();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized("You are not logged in!");
        }

        return Ok(await notificationService.UnseenNotificationsAsync(userId));
    }

    [HttpPost("see")]
    public async Task<IActionResult> SeeNotification(SeeNotificationRequest dto)
    {
        var userId = GetUserIdByToken();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized("You are not logged in!");
        }

        var result = await notificationService.SeeNotificationAsync(userId, dto.NotificationId);

        if (result)
        {
            return Ok();
        }

        return BadRequest();
    }
}