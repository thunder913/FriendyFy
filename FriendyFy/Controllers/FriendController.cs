using System.Threading.Tasks;
using FriendyFy.Data.Requests;
using FriendyFy.Hubs;
using FriendyFy.Services.Contracts;
using FriendyFy.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace FriendyFy.Controllers;

[Route("friend")]
[ApiController]
public class FriendController : BaseController
{
    private readonly IFriendService friendService;
    private readonly IHubContext<NotificationHub> notificationHub;
    private readonly INotificationService notificationService;

    public FriendController(IFriendService friendService,
        IHubContext<NotificationHub> notificationHub,
        INotificationService notificationService)
    {
        this.friendService = friendService;
        this.notificationHub = notificationHub;
        this.notificationService = notificationService;
    }

    [HttpPost]
    public async Task<IActionResult> AddFriend(UserIdRequest dto)
    {
        var user = await GetUserByToken();
            
        if (user == null || dto.UserId == null)
        {
            return BadRequest("The user cannot be added as a friend!");
        }

        var result = await friendService.AddFriendToUserAsync(user.Id, dto.UserId);
        if (!result)
        {
            return BadRequest("Cannot add friend!");
        }

        var notification = await notificationService.CreateFriendRequestNotification(user, dto.UserId);
        var receiverId = (await UserService.GetByUsernameAsync(dto.UserId)).Id;
        if (notification != null)
        {
            await notificationHub.Clients.User(receiverId).SendAsync(receiverId, notification);
        }
        return Ok();
    }

    [HttpPost("accept")]
    public async Task<IActionResult> AcceptFriendRequest(UserIdRequest dto)
    {
        var user = await GetUserByToken();
            
        if (user == null || dto.UserId == null)
        {
            return BadRequest("The user cannot be added as a friend!");
        }

        var result = await friendService.AcceptFriendRequestAsync(user.Id, dto.UserId);
        if (!result)
        {
            return BadRequest("Cannot accept friend request!");
        }

        await notificationService.ChangeUserFriendNotificationStatus(dto.UserId, user.Id);
        return Ok();
    }

    [HttpPost("cancel")]
    public async Task<IActionResult> CancelFriendRequest(UserIdRequest dto)
    {
        var user = await GetUserByToken();
            
        if (user == null || dto.UserId == null)
        {
            return BadRequest("The friend request cannot be cancelled!");
        }

        var result = await friendService.CancelFriendRequestAsync(user.Id, dto.UserId);
        if (!result)
        {
            return BadRequest("Cannot cancel friend request!");
        }

        await notificationService.ChangeUserFriendNotificationStatus(dto.UserId, user.Id);
        await notificationService.ChangeUserFriendNotificationStatus(user.Id, dto.UserId);
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetFriendsToShow([FromQuery] FriendsRequest dto)
    {
        var user = await GetUserByToken();

        if (dto == null || dto.UserId == null)
        {
            return BadRequest("Invalid user!");
        }

        var friends = friendService.GetUserFriends(dto.UserId, dto.Skip, dto.Count, user != null ? user.Id : null, dto.SearchQuery);
        var friendsCount = await friendService.GetUserFriendsCountAsync(dto.UserId);

        return Ok(new ProfileSidebarFriendsViewModel
        {
            Friends = friends,
            FriendsCount = friendsCount
        });
    }

    [HttpDelete]
    public async Task<IActionResult> RemoveFriend(UserIdRequest dto)
    {
        var user = await GetUserByToken();
            
        if (user == null || dto.UserId == null)
        {
            return BadRequest("The friend cannot be removed!");
        }

        var result = await friendService.RemoveFriendAsync(user.Id, dto.UserId);
        if (!result)
        {
            return BadRequest("Cannot remove friend!");
        }

        return Ok();
    }

    [HttpGet("status/{id}")]
    public async Task<IActionResult> CheckFriendStatus(string id)
    {
        var user = await GetUserByToken();
            
        if (user == null || id == null)
        {
            return BadRequest("The user cannot be added as a friend!");
        }

        return Content((await friendService.GetUserFriendStatusAsync(user.Id, id)).ToString());
    }

    [HttpGet("recommendations")]
    public async Task<IActionResult> GetFriendRecommendations()
    {
        var user = await GetUserByToken();
            
        if (user == null)
        {
            return BadRequest("You are not current logged in!");
        }

        return Ok(await friendService.GetFriendRecommendationsAsync(user.Id));
    }

    [HttpDelete("suggestion")]
    public async Task<IActionResult> GetFriendRecommendations(UserIdRequest dto)
    {
        var user = await GetUserByToken();
            
        if (user == null)
        {
            return BadRequest("You are not current logged in!");
        }

        await friendService.RemovePersonFromSuggestionsAsync(user.Id, dto.UserId);
        return Ok();
    }

    [HttpGet("suggestions")]
    public async Task<IActionResult> GetRightNavRecommendations()
    {
        var user = await GetUserByToken();
            
        if (user == null)
        {
            return BadRequest();
        }

        return Ok(await UserService.GetEventUserRecommendationsAsync(user.Id));
    }
}