using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using ViewModels;

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
            return this.chatRepository
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
                        : x.Image,
                })
                .ToList();

        }

        public ChatViewModel GetChatMessages(string userId ,string chatId, int take, int skip)
        {
            var chat = this.chatRepository
                .AllAsNoTracking()
                .Include(x => x.Messages)
                .FirstOrDefault(x => x.Id == chatId);

            var model = new ChatViewModel()
            {
                Image = chat.Image,
                Name = chat.Name,
                Messages = chat
                    .Messages
                    .OrderByDescending(x => x.CreatedOn)
                    .Skip(skip)
                    .Take(take)
                    .Select(x => new ChatMessageViewModel()
                    {
                        Date = x.CreatedOn,
                        Message = x.Text,
                        Name = x.User.FirstName + " " + x.User.LastName,
                        Photo = chat.ChatType == ChatType.Direct
                        ? this.blobService.GetBlobUrlAsync(chat.Users.FirstOrDefault(y => y.Id != userId).UserName + ".jpeg", GlobalConstants.BlobProfilePictures).GetAwaiter().GetResult()
                        : chat.Image,
                        IsYourMessage = x.User.Id == userId
                    })
                    .ToList()
            };

            return model;
        }
    }
}
