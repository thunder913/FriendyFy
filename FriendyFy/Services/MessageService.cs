using System.Linq;
using System.Threading.Tasks;
using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using Microsoft.EntityFrameworkCore;
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

        public async Task<ChatMessageViewModel> GetChatMessageForOtherPeopleAsync(string id)
        {
            var message = await messageRepository
                .AllAsNoTracking()
                .Include(x => x.User)
                .ThenInclude(x => x.ProfileImage)
                .FirstOrDefaultAsync(x => x.Id == id);

            return new ChatMessageViewModel
            {
                Date = message.CreatedOn,
                IsYourMessage = false,
                Message = message.Text,
                MessageId = message.Id,
                Name = message.User.FirstName + " " + message.User.LastName,
                Username = message.User.UserName,
                Photo = blobService.GetBlobUrlAsync(message.User.ProfileImage?.Id + message.User.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
            };
        }
    }
}
