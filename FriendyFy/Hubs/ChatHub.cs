using System.Linq;
using System.Threading.Tasks;
using FriendyFy.Data.Requests;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.SignalR;

namespace FriendyFy.Hubs;

public class ChatHub : Hub
{
    private IChatService chatService { get; }
    public ChatHub(IChatService chatService)
    {
        this.chatService = chatService;
    }
    public async Task<bool> SendMessage(SendMessageRequest dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Message))
        {
            return false;
        }

        var userId = Context.UserIdentifier;

        var viewModel = await chatService.SendChatMessage(dto.ChatId, userId, dto.Message);

        if (viewModel == null)
        {
            return false;
        }
            
        var usersInChat = chatService.GetChatUserIds(dto.ChatId).Where(x => x != userId).ToList();

        await Clients.Users(usersInChat).SendAsync(dto.ChatId, viewModel);

        viewModel.IsYourMessage = true;
            
        await Clients.User(userId).SendAsync(dto.ChatId, viewModel);

        return true;
    }
}