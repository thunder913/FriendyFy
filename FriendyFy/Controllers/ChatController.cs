using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace FriendyFy.Controllers
{
    [Route("chat")]
    [ApiController]
    public class ChatController : BaseController
    {
        private readonly IChatService chatService;

        public ChatController(IChatService chatService)
        {
            this.chatService = chatService;
        }

        [HttpGet("getChats/{username}")]
        public IActionResult GetUserChats(string username)
        {
            var user = this.GetUserByToken();

            if (user.UserName != username)
            {
                return Unauthorized("You are not signed in!");
            }

            return Ok(this.chatService.GetUserChats(username));
        }

        [HttpPost("getChat")]
        public IActionResult GetUserChats([FromBody] GetChatDto dto)
        {
            var user = this.GetUserByToken();

            if (user.UserName != dto.Username)
            {
                return Unauthorized("You are not signed in!");
            }

            return Ok(this.chatService.GetChatMessages(user.Id, dto.ChatId, dto.Take, dto.Skip));
        }
    }
}
