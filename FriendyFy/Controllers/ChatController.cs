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
        private readonly IHubContext<ChatHub> chatHub;
        private readonly IMessageService messageService;
        public ChatController(IChatService chatService,
            IHubContext<ChatHub> chatHub, IMessageService messageService)
        {
            this.chatService = chatService;
            this.chatHub = chatHub;
            this.messageService = messageService;
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
        public IActionResult GetUserChat([FromBody] GetChatDto dto)
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

            var messageId = await this.chatService.SendChatMessage(dto.ChatId, user.Id, dto.Message);

            if (messageId == null)
            {
                return BadRequest();
            }

            var usersInChat = this.chatService.GetChatUserIds(dto.ChatId).Where(x => x != user.Id).ToList();

            var messageForOtherPeople = this.messageService.GetChatMessageForOtherPeople(messageId);
            if (messageForOtherPeople == null)
            {
                return BadRequest();
            }

            await this.chatHub.Clients.Users(usersInChat).SendAsync("ReceiveMessage", messageForOtherPeople);

            return Ok();
        }
    }
}
