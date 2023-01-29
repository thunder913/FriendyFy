using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface IMessageService
    {
        Task<ChatMessageViewModel> GetChatMessageForOtherPeopleAsync(string id);
    }
}
