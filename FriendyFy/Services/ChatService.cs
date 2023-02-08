using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Data.Dtos;
using FriendyFy.Mapping;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using FriendyFy.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace FriendyFy.Services;

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

    public async Task<List<ChatFooterUserDto>> GetUserChatsAsync(string username, int page, int itemsPerPage,int items, string search, List<string> chatIds)
    {
        return await chatRepository
            .AllAsNoTracking()
            .Where(x => x.Users.Any(y => y.UserName == username))
            .Where(x => x.ChatType != ChatType.NotAccepted)
            .Where(x => string.IsNullOrWhiteSpace(search) || (x.Users.Where(y => y.UserName != username).Any(y => (y.FirstName+" "+y.LastName).ToLower().Contains(search.ToLower()))))
            .Where(x => chatIds.All(y => y != x.Id)) 
            .OrderBy(x => x.Id)
            .Skip(items*page)
            .Take(items)
            .Select(x => new ChatFooterUserDto
            {
                ChatId = x.Id,
                Name = x.ChatType == ChatType.Direct ? x.Users.FirstOrDefault(y => y.UserName != username).FirstName : x.Name,
                FullName = x.ChatType == ChatType.Direct ? x.Users.FirstOrDefault(y => y.UserName != username).FirstName + " " + x.Users.FirstOrDefault(y => y.UserName != username).LastName : x.Name,
                IsActive = false,
                NewMessages = x.Messages.Count - x.Messages.Count(y => y.SeenBy.Any(y => y.UserName == username)),
                Picture = x.ChatType == ChatType.Direct
                    ? blobService.GetBlobUrlAsync(x.Users.FirstOrDefault(y => y.UserName != username).ProfileImage.Id + x.Users.FirstOrDefault(y => y.UserName != username).ProfileImage.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult()
                    : x.Image,
            })
            .ToListAsync();
    }

    public async Task<ChatViewModel> GetChatMessagesAsync(string userId, string chatId, int take, int skip)
    {
        var chat = await chatRepository
            .AllAsNoTracking()
            .Include(x => x.Messages)
            .ThenInclude(x => x.SeenBy)
            .Include(x => x.Messages)
            .ThenInclude(x => x.User)
            .ThenInclude(x => x.ProfileImage)
            .Include(x => x.Users)
            .ThenInclude(x => x.ProfileImage)
            .FirstOrDefaultAsync(x => x.Id == chatId);

        string photo = chat.Image;
        string chatName = chat.Name;

        if (chat.ChatType == ChatType.Direct)
        {
            var otherUser = chat.Users.FirstOrDefault(x => x.Id != userId);

            photo = blobService.GetBlobUrlAsync(otherUser?.ProfileImage?.Id + otherUser?.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult();
            chatName = otherUser?.FirstName + " " + otherUser?.LastName;
        }

        var model = new ChatViewModel
        {
            Image = photo,
            Name = chatName,
            Messages = chat
                .Messages
                .OrderByDescending(x => x.CreatedOn)
                .Skip(skip)
                .Take(take)
                .OrderByDescending(x => x.CreatedOn)
                .Select(x => new ChatMessageViewModel
                {
                    Date = x.CreatedOn,
                    Message = x.Text,
                    Name = x.User.FirstName + " " + x.User.LastName,
                    Photo = blobService.GetBlobUrlAsync(x.User.ProfileImage?.Id + x.User.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    IsYourMessage = x.User.Id == userId,
                    MessageId = x.Id,
                    Username = x.User.UserName
                })
                .ToList()
        };

        return model;
    }

    public async Task<ChatMessageViewModel> SendChatMessage(string chatId, string userId, string message)
    {
        var user = await userRepository
            .All()
            .Include(u => u.ProfileImage)
            .FirstOrDefaultAsync(x => x.Id == userId);
        
        var chat = chatRepository.All().Include(x => x.Users).FirstOrDefault(x => x.Id == chatId);
        if (chat == null)
        {
            return null;
        }

        if (chat.Users.All(x => x.Id != userId))
        {
            return null;
        }

        var messageObj = new Message
        {
            Chat = chat,
            CreatedOn = DateTime.UtcNow,
            Text = message,
            UserId = userId,
            SeenBy = { user }
        };
        
        chat.Messages.Add(messageObj);
        await chatRepository.SaveChangesAsync();

        var viewModel = AutoMapperConfig.MapperInstance.Map<Message, ChatMessageViewModel>(messageObj);
        
        viewModel.Name = user.FirstName + " " + user.LastName;
        viewModel.Photo = blobService.GetBlobUrlAsync(user.ProfileImage?.Id + user.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult();
        viewModel.Username = user.UserName;
        
        return viewModel;
    }

    public List<string> GetChatUserIds(string chatId)
    {
        return chatRepository
            .AllAsNoTracking()
            .Include(x => x.Users)
            .ThenInclude(x => x.ProfileImage)
            .FirstOrDefault(x => x.Id == chatId)?
            .Users
            .Select(x => x.Id)
            .ToList();
    }

    public async Task<bool> SeeMessagesAsync(string chatId, ApplicationUser user)
    {
        var notSeenMessages =
            chatRepository
                .All()
                .Include(x => x.Messages)
                .ThenInclude(x => x.SeenBy)
                .FirstOrDefault(x => x.Id == chatId)?
                .Messages
                .Where(x => x.SeenBy.All(y => y.Id != user.Id));

        foreach (var message in notSeenMessages)
        {
            message.SeenBy.Add(user);
        }

        await chatRepository.SaveChangesAsync();

        return true;
    }
}