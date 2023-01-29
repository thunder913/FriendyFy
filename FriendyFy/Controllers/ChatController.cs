using System.Collections.Generic;
using System.Threading.Tasks;
using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

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

        [HttpPost("getChats")]
        public IActionResult GetUserChats(GetChatsDto dto)
        {
            var user = GetUserByToken();

            var chatIds = new List<string>();
            if (!string.IsNullOrWhiteSpace(dto.ChatIds))
            {
                chatIds = JsonConvert.DeserializeObject<List<string>>(dto.ChatIds);
            }
            if (user.UserName != dto.Username)
            {
                return Unauthorized("You are not signed in!");
            }

            return Ok(chatService.GetUserChats(dto.Username, dto.Page, dto.ItemsPerPage, dto.Take, dto.Search, chatIds));
        }

        [HttpPost("getChat")]
        public async Task<IActionResult> GetUserChat([FromBody] GetChatDto dto)
        {
            var user = GetUserByToken();

            if (user.UserName != dto.Username)
            {
                return Unauthorized("You are not signed in!");
            }

            var chat = await chatService.GetChatMessagesAsync(user.Id, dto.ChatId, dto.Take, dto.Skip);

            return Ok(chat);
        }

        [HttpPost("seeMessages")]
        public async Task<IActionResult> SeenMessage([FromBody] GetChatDto dto)
        {
            var user = GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not signed in!");
            }

            return Ok(await chatService.SeeMessagesAsync(dto.ChatId, user));
        }
    }
}
