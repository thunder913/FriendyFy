using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Hubs;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Services
{
    public class ChatService : IChatService
    {
        private readonly IDeletableEntityRepository<Chat> chatRepository;
        private readonly IBlobService blobService;
        private readonly IHubContext<ChatHub> chatHub;

        public ChatService(IDeletableEntityRepository<Chat> chatRepository,
            IBlobService blobService, 
            IHubContext<ChatHub> chatHub)
        {
            this.chatRepository = chatRepository;
            this.blobService = blobService;
            this.chatHub = chatHub;
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
                .ThenInclude(x => x.User)
                .Include(x => x.Users)
                .FirstOrDefault(x => x.Id == chatId);

            string photo = chat.Image;
            string chatName = chat.Name;

            if (chat.ChatType == ChatType.Direct)
            {
                var otherUser = chat.Users.FirstOrDefault(x => x.Id != userId);

                photo = this.blobService.GetBlobUrlAsync(otherUser.UserName + ".jpeg", GlobalConstants.BlobProfilePictures).GetAwaiter().GetResult();
                chatName = otherUser.FirstName + " " + otherUser.LastName;
            }

            var model = new ChatViewModel()
            {
                Image = photo,
                Name = chatName,
                Messages = chat
                    .Messages
                    .OrderByDescending(x => x.CreatedOn)
                    .Skip(skip)
                    .Take(take)
                    // Reordering them on the FE
                    .OrderByDescending(x => x.CreatedOn)
                    .Select(x => new ChatMessageViewModel()
                    {
                        Date = x.CreatedOn,
                        Message = x.Text,
                        Name = x.User.FirstName + " " + x.User.LastName,
                        Photo = this.blobService.GetBlobUrlAsync(x.User.UserName + ".jpeg", GlobalConstants.BlobProfilePictures).GetAwaiter().GetResult(),
                        IsYourMessage = x.User.Id == userId,
                        MessageId = x.Id
                    })
                    .ToList()
            };

            return model;
        }

        public async Task<string> SendChatMessage(string chatId, string userId, string message)
        {
            var chat = this.chatRepository.All().Include(x => x.Users).FirstOrDefault(x => x.Id == chatId);
            if (chat == null)
            {
                return null;
            }

            if (!chat.Users.Any(x => x.Id == userId))
            {
                return null;
            }

            var messageObj = new Message()
            {
                Chat = chat,
                CreatedOn = DateTime.UtcNow,
                Text = message,
                UserId = userId,
            };

            chat.Messages.Add(messageObj);
            await chatRepository.SaveChangesAsync();

            return messageObj.Id;
        }

        public List<string> GetChatUserIds(string chatId)
        {
            return this.chatRepository
                .AllAsNoTracking()
                .Include(x => x.Users)
                .FirstOrDefault(x => x.Id == chatId)
                .Users
                .Select(x => x.Id)
                .ToList();
        }
    }
}
