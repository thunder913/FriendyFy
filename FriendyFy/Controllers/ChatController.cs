using FriendyFy.Data;
using FriendyFy.Hubs;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System.Threading.Tasks;
using ViewModels;

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
        public async Task<IActionResult> GetUserChat([FromBody] GetChatDto dto)
        {
            var user = this.GetUserByToken();

            if (user.UserName != dto.Username)
            {
                return Unauthorized("You are not signed in!");
            }

            var chat = this.chatService.GetChatMessages(user.Id, dto.ChatId, dto.Take, dto.Skip);
            //await this.SeenMessage(dto.ChatId);

            return Ok(chat);
        }

        [HttpPost("seeMessages")]
        public async Task<IActionResult> SeenMessage([FromBody] GetChatDto dto)
        {
            var user = this.GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not signed in!");
            }

            return Ok(await this.chatService.SeeMessagesAsync(dto.ChatId, user));
        }
    }
}
