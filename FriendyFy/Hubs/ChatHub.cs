using System.Linq;
using System.Threading.Tasks;
using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.SignalR;

namespace FriendyFy.Hubs
{
    public class ChatHub : Hub
    {
        private IChatService chatService { get; set; }
        private IMessageService messageService { get; set; }
        public ChatHub(IChatService chatService, IMessageService messageService)
        {
            this.chatService = chatService;
            this.messageService = messageService;
        }
        public async Task<bool> SendMessage(SendMessageDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                return false;
            }

            var userId = Context.UserIdentifier;

            //TODO simplify the logic by returning the message object from the sendchatmessage, there is no need of messageService
            var messageId = await chatService.SendChatMessage(dto.ChatId, userId, dto.Message);

            if (messageId == null)
            {
                return false;
            }
            
            var usersInChat = chatService.GetChatUserIds(dto.ChatId).Where(x => x != userId).ToList();

            var message = await messageService.GetChatMessageForOtherPeopleAsync(messageId);
            if (message == null)
            {
                return false;
            }

            await Clients.Users(usersInChat).SendAsync(dto.ChatId, message);

            message.IsYourMessage = true;
            
            await Clients.User(userId).SendAsync(dto.ChatId, message);

            return true;
        }
    }
}
