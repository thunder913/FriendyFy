using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

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

        [HttpPost("sendMessage")]
        public async Task<IActionResult> SendMessage(SendMessageDto dto)
        {
            var user = this.GetUserByToken();

            var response = await this.chatService.SendChatMessage(dto.ChatId, user.Id, dto.Message);

            if (!response)
            {
                return BadRequest();
            }

            return Ok();
        }
    }
}
