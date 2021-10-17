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

        [HttpPost("checkFriendStatus")]
        public async Task<IActionResult> CheckFriendStatus(FriendIdDto dto)
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
