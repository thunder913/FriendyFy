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
        private readonly IDeletableEntityRepository<ApplicationUser> userRepository;

        public ChatService(IDeletableEntityRepository<Chat> chatRepository,
            IBlobService blobService, IDeletableEntityRepository<ApplicationUser> userRepository)
        {
            this.chatRepository = chatRepository;
            this.blobService = blobService;
            this.userRepository = userRepository;
        }

        public List<ChatFooterUserDto> GetUserChats(string username, int page, int itemsPerPage,int items, string search)
        {
            return this.chatRepository
                .AllAsNoTracking()
                .Include(x => x.Messages)
                .ThenInclude(x => x.SeenBy)
                .Include(x => x.Users)
                .ThenInclude(x => x.ProfileImage)
                .Where(x => x.Users.Any(y => y.UserName == username))
                .Where(x => x.ChatType != ChatType.NotAccepted)
                .Where(x => string.IsNullOrWhiteSpace(search) || (x.Users.Any(y => (y.FirstName+" "+y.LastName).ToLower().Contains(search.ToLower()))))
                .OrderBy(x => x.Id)
                .Skip(page * itemsPerPage)
                .Take(items)
                // TODO remove this tolist
                .ToList()
                .Select(x => new ChatFooterUserDto()
                {
                    ChatId = x.Id,
                    Name = x.ChatType == ChatType.Direct ? x.Users.FirstOrDefault(y => y.UserName != username)?.FirstName : x.Name,
                    FullName = x.ChatType == ChatType.Direct ? x.Users.FirstOrDefault(y => y.UserName != username)?.FirstName + " " + x.Users.FirstOrDefault(y => y.UserName != username)?.LastName : x.Name,
                    IsActive = false,
                    NewMessages = x.Messages.Count() - x.Messages.Where(y => y.SeenBy.Any(y => y.UserName == username)).Count(),
                    Picture = x.ChatType == ChatType.Direct
                        ? this.blobService.GetBlobUrlAsync(x.Users.FirstOrDefault(y => y.UserName != username)?.ProfileImage?.Id + x.Users.FirstOrDefault(y => y.UserName != username)?.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult()
                        : x.Image,
                })
                .ToList();

        }

        public ChatViewModel GetChatMessages(string userId, string chatId, int take, int skip)
        {
            var chat = this.chatRepository
                .All()
                .Include(x => x.Messages)
                .ThenInclude(x => x.SeenBy)
                .Include(x => x.Messages)
                .ThenInclude(x => x.User)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Users)
                .ThenInclude(x => x.ProfileImage)
                .FirstOrDefault(x => x.Id == chatId);

            string photo = chat.Image;
            string chatName = chat.Name;

            if (chat.ChatType == ChatType.Direct)
            {
                var otherUser = chat.Users.FirstOrDefault(x => x.Id != userId);

                photo = this.blobService.GetBlobUrlAsync(otherUser.ProfileImage?.Id + otherUser.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult();
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
                        Photo = this.blobService.GetBlobUrlAsync(x.User.ProfileImage?.Id + x.User.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                        IsYourMessage = x.User.Id == userId,
                        MessageId = x.Id,
                        Username = x.User.UserName
                    })
                    .ToList()
            };

            return model;
        }

        public async Task<string> SendChatMessage(string chatId, string userId, string message)
        {
            var user = this.userRepository.All().FirstOrDefault(x => x.Id == userId);
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
                SeenBy = { user }
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
                .ThenInclude(x => x.ProfileImage)
                .FirstOrDefault(x => x.Id == chatId)
                .Users
                .Select(x => x.Id)
                .ToList();
        }

        public async Task<bool> SeeMessagesAsync(string chatId, ApplicationUser user)
        {
            var notSeenMessages =
                this.chatRepository
                .All()
                .Include(x => x.Messages)
                .ThenInclude(x => x.SeenBy)
                .FirstOrDefault(x => x.Id == chatId)
                .Messages
                .Where(x => !x.SeenBy.Any(y => y.Id == user.Id));

            foreach (var message in notSeenMessages)
            {
                message.SeenBy.Add(user);
            }

            await this.chatRepository.SaveChangesAsync();

            return true;
        }
    }
}
