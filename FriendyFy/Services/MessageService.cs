using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ViewModels;

namespace FriendyFy.Services
{
    public class MessageService : IMessageService
    {
        private readonly IDeletableEntityRepository<Message> messageRepository;
        private readonly IBlobService blobService;

        public MessageService(IDeletableEntityRepository<Message> messageRepository, IBlobService blobService)
        {
            this.messageRepository = messageRepository;
            this.blobService = blobService;
        }

        public ChatMessageViewModel GetChatMessageForOtherPeople(string id)
        {
            var messages = this.messageRepository.AllAsNoTracking().Where(x => x.Id == id);
            return this.messageRepository
                .AllAsNoTracking()
                .Include(x => x.User)
                .Select(x => new ChatMessageViewModel()
                {
                    Date = x.CreatedOn,
                    IsYourMessage = false,
                    Message = x.Text,
                    MessageId = x.Id,
                    Name = x.User.FirstName + " " + x.User.LastName,
                    Photo = this.blobService.GetBlobUrlAsync(x.User.UserName + ".jpeg", GlobalConstants.BlobProfilePictures).GetAwaiter().GetResult()
                })
                .FirstOrDefault(x => x.MessageId == id);
        }
    }
}
