using FriendyFy.Data;
using FriendyFy.Hubs;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Controllers
{
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
            var user = this.GetUserByToken();
            var receiverId = this.UserService.GetByUsername(dto.UserId).Id;
            if (user == null || dto.UserId == null)
            {
                return BadRequest("The user cannot be added as a friend!");
            }

            var result = await this.friendService.AddFriendToUserAsync(user.Id, dto.UserId);
            if (!result)
            {
                return BadRequest("Cannot add friend!");
            }

            var notification = await this.notificationService.CreateFriendRequestNotification(user, dto.UserId);
            if (notification != null)
            {
                await this.notificationHub.Clients.User(receiverId).SendAsync(receiverId, notification);
            }
            return Ok();
        }

        [HttpPost("accept")]
        public async Task<IActionResult> AcceptFriendRequest(FriendIdDto dto)
        {
            var user = this.GetUserByToken();
            if (user == null || dto.UserId == null)
            {
                return BadRequest("The user cannot be added as a friend!");
            }

            var result = await this.friendService.AcceptFriendRequestAsync(user.Id, dto.UserId);
            if (!result)
            {
                return BadRequest("Cannot acccept friend request!");
            }

            await this.notificationService.ChangeUserFriendNotificationStatus(dto.UserId, user.Id);
            return Ok();
        }

        [HttpPost("cancel")]
        public async Task<IActionResult> CancelFriendRequest(FriendIdDto dto)
        {
            var user = this.GetUserByToken();
            if (user == null || dto.UserId == null)
            {
                return BadRequest("The friend request cannot be cancelled!");
            }

            var result = await this.friendService.CancelFriendRequestAsync(user.Id, dto.UserId);
            if (!result)
            {
                return BadRequest("Cannot cancel friend request!");
            }

            await this.notificationService.ChangeUserFriendNotificationStatus(dto.UserId, user.Id);
            await this.notificationService.ChangeUserFriendNotificationStatus(user.Id, dto.UserId);
            return Ok();
        }

        [HttpPost("getFriends")]
        public IActionResult GetFriendsToShow(GetFriendsDto dto)
        {
            var user = this.GetUserByToken();

            if (dto == null || dto.UserId == null)
            {
                return BadRequest("Invalid user!");
            }

            var friends = this.friendService.GetUserFriends(dto.UserId, dto.Skip, dto.Count, user != null ? user.Id : null, dto.SearchQuery);
            var friendsCount = this.friendService.GetUserFriendsCount(dto.UserId);

            return Ok(new ProfileSidebarFriendsViewModel() 
            {
                Friends = friends,
                FriendsCount = friendsCount
            });
        }

        [HttpPost("remove")]
        public async Task<IActionResult> RemoveFriend(FriendIdDto dto)
        {
            var user = this.GetUserByToken();
            if (user == null || dto.UserId == null)
            {
                return BadRequest("The friend cannot be removed!");
            }

            var result = await this.friendService.RemoveFriendAsync(user.Id, dto.UserId);
            if (!result)
            {
                return BadRequest("Cannot remove friend!");
            }

            return Ok();
        }

        [HttpPost("checkFriendStatus")]
        public IActionResult CheckFriendStatus(FriendIdDto dto)
        {
            var user = this.GetUserByToken();
            if (user == null || dto.UserId == null)
            {
                return BadRequest("The user cannot be added as a friend!");
            }

            return Content(this.friendService.GetUserFriendStatus(user.Id, dto.UserId));
        }

        [HttpPost("getRecommendations")]
        public IActionResult GetFriendRecommendations()
        {
            var user = this.GetUserByToken();
            if (user == null)
            {
                return BadRequest("You are not current logged in!");
            }

            return Ok(this.friendService.GetFriendRecommendations(user.Id));
        }

        [HttpPost("removeSuggestion")]
        public async Task<IActionResult> GetFriendRecommendations(FriendIdDto dto)
        {
            var user = this.GetUserByToken();
            if (user == null)
            {
                return BadRequest("You are not current logged in!");
            }

            await this.friendService.RemovePersonFromSuggestionsAsync(user.Id, dto.UserId);
            return Ok();
        }

        [HttpPost("getRightNavSuggestions")]
        public IActionResult GetRightNavRecommendations()
        {
            var user = this.GetUserByToken();
            if (user == null)
            {
                return BadRequest();
            }

            return Ok(this.UserService.GetEventUserRecommendations(user.Id));
        }
    }
}
