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
            return Ok(this.chatService.GetUserChats(username));
        }

    }
}
