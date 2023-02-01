using System.Threading.Tasks;
using FriendyFy.Data;
using FriendyFy.Hubs;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ViewModels;

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

    [HttpPost("add")]
    public async Task<IActionResult> AddFriend(FriendIdDto dto)
    {
        var user = GetUserByToken();
            
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
        var receiverId = UserService.GetByUsername(dto.UserId).Id;
        if (notification != null)
        {
            await notificationHub.Clients.User(receiverId).SendAsync(receiverId, notification);
        }
        return Ok();
    }

    [HttpPost("accept")]
    public async Task<IActionResult> AcceptFriendRequest(FriendIdDto dto)
    {
        var user = GetUserByToken();
            
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
    public async Task<IActionResult> CancelFriendRequest(FriendIdDto dto)
    {
        var user = GetUserByToken();
            
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

    [HttpPost("getFriends")]
    public IActionResult GetFriendsToShow(GetFriendsDto dto)
    {
        var user = GetUserByToken();

        if (dto == null || dto.UserId == null)
        {
            return BadRequest("Invalid user!");
        }

        var friends = friendService.GetUserFriends(dto.UserId, dto.Skip, dto.Count, user != null ? user.Id : null, dto.SearchQuery);
        var friendsCount = friendService.GetUserFriendsCount(dto.UserId);

        return Ok(new ProfileSidebarFriendsViewModel
        {
            Friends = friends,
            FriendsCount = friendsCount
        });
    }

    [HttpPost("remove")]
    public async Task<IActionResult> RemoveFriend(FriendIdDto dto)
    {
        var user = GetUserByToken();
            
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

    [HttpPost("checkFriendStatus")]
    public async Task<IActionResult> CheckFriendStatus(FriendIdDto dto)
    {
        var user = GetUserByToken();
            
        if (user == null || dto.UserId == null)
        {
            return BadRequest("The user cannot be added as a friend!");
        }

        return Content(await friendService.GetUserFriendStatusAsync(user.Id, dto.UserId));
    }

    [HttpPost("getRecommendations")]
    public IActionResult GetFriendRecommendations()
    {
        var user = GetUserByToken();
            
        if (user == null)
        {
            return BadRequest("You are not current logged in!");
        }

        return Ok(friendService.GetFriendRecommendations(user.Id));
    }

    [HttpPost("removeSuggestion")]
    public async Task<IActionResult> GetFriendRecommendations(FriendIdDto dto)
    {
        var user = GetUserByToken();
            
        if (user == null)
        {
            return BadRequest("You are not current logged in!");
        }

        await friendService.RemovePersonFromSuggestionsAsync(user.Id, dto.UserId);
        return Ok();
    }

    [HttpPost("getRightNavSuggestions")]
    public async Task<IActionResult> GetRightNavRecommendations()
    {
        var user = GetUserByToken();
            
        if (user == null)
        {
            return BadRequest();
        }

        return Ok(await UserService.GetEventUserRecommendationsAsync(user.Id));
    }
}