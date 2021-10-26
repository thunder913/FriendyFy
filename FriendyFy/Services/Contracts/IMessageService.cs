using ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface IMessageService
    {
        ChatMessageViewModel GetChatMessageForOtherPeople(string id);
    }
}
