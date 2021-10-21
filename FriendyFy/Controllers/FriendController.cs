using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FriendyFy.Controllers
{
    [Route("friend")]
    [ApiController]
    public class FriendController : BaseController
    {
        private readonly IFriendService friendService;

        public FriendController(IFriendService friendService)
        {
            this.friendService = friendService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddFriend(FriendIdDto dto)
        {
            var user = this.GetUserByToken();
            if (user == null || dto.UserId == null)
            {
                return BadRequest("The user cannot be added as a friend!");
            }

            var result = await this.friendService.AddFriendToUserAsync(user.Id, dto.UserId);
            if (!result)
            {
                return BadRequest("Cannot add friend!");
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

            return Ok();
        }

        [HttpPost("getFriendsToShow")]
        public async Task<IActionResult> GetFriendsToShow(GetFriendsDto dto)
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

            return Ok();
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
    }
}
