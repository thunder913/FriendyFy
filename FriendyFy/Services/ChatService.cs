using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using System.Collections.Generic;
using System.Linq;

namespace FriendyFy.Services
{
    public class ChatService : IChatService
    {
        private readonly IDeletableEntityRepository<Chat> chatRepository;
        private readonly IBlobService blobService;

        public ChatService(IDeletableEntityRepository<Chat> chatRepository,
            IBlobService blobService)
        {
            this.chatRepository = chatRepository;
            this.blobService = blobService;
        }

        public List<ChatFooterUserDto> GetUserChats(string username)
        {
            return chatRepository
                .AllAsNoTracking()
                .Where(x => x.Users.Any(y => y.UserName == username))
                .Select(x => new ChatFooterUserDto()
                {
                    ChatId = x.Id,
                    Name = x.ChatType == ChatType.Direct ? x.Users.FirstOrDefault(y => y.UserName != username).FirstName : x.Name,
                    IsActive = false,
                    NewMessages = 0,
                    Picture = x.ChatType == ChatType.Direct 
                        ? this.blobService.GetBlobUrlAsync(x.Users.FirstOrDefault(y => y.UserName != username).UserName + ".jpeg", GlobalConstants.BlobProfilePictures).GetAwaiter().GetResult() 
                        : "",
                })
                .ToList();

        }
    }
}
