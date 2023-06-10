using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Data.Dtos;
using FriendyFy.Mapping;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using FriendyFy.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace FriendyFy.Services;

public class NotificationService : INotificationService
{
    private readonly IRepository<Notification> notificationRepository;
    private readonly IDeletableEntityRepository<Event> eventRepository;
    private readonly IDeletableEntityRepository<ApplicationUser> userRepository;
    private readonly IBlobService blobService;
    private readonly IEventService eventService;
    private readonly IMapper mapper;
    public NotificationService(IRepository<Notification> notificationRepository,
        IDeletableEntityRepository<Event> eventRepository,
        IDeletableEntityRepository<ApplicationUser> userRepository,
        IBlobService blobService,
        IEventService eventService)
    {
        this.notificationRepository = notificationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.blobService = blobService;
        this.eventService = eventService;
        mapper = AutoMapperConfig.MapperInstance;
    }

    public async Task<NotificationViewModel> CreateNotificationAsync(ApplicationUser inviter, string inviteeUsername, string eventId)
    {
        var currEvent = await eventRepository.AllAsNoTracking()
            .Include(x => x.Users)
            .Where(x => x.Users.All(y => y.UserName != inviteeUsername))
            .Select(x => new
            {
                x.Id,
                x.Name
            })
            .FirstOrDefaultAsync(x => x.Id == eventId);

        var inviteeUser = await userRepository.AllAsNoTracking().FirstOrDefaultAsync(x => x.UserName == inviteeUsername);

        if (currEvent == null || inviteeUser == null)
        {
            return null;
        }

        var existing = await notificationRepository
            .All()
            .Include(x => x.Invitee)
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.InviterId == inviter.Id && x.Invitee.UserName == inviteeUsername && x.IsAvailable);

        if (existing != null)
        {
            existing.ModifiedOn = DateTime.UtcNow;
            await notificationRepository.SaveChangesAsync();
            return null;
        }

        var notification = new Notification
        {
            EventId = eventId,
            InviteeId = inviteeUser.Id,
            InviterId = inviter.Id,
            CreatedOn = DateTime.UtcNow,
            IsAvailable = true
        };

        notification.ModifiedOn = notification.CreatedOn;

        notificationRepository.Add(notification);
        await notificationRepository.SaveChangesAsync();
        var toReturn = new NotificationViewModel
        {
            Id = notification.Id,
            Image = blobService.GetBlobUrl(inviter.ProfileImage.Id + inviter.ProfileImage.ImageExtension, GlobalConstants.BlobPictures),
            Name = inviter.FirstName,
            Type = "event",
            EventName = currEvent.Name,
            InviterUsername = inviter.UserName,
            Date = notification.ModifiedOn,
            EventId = notification.EventId,
            IsAvailable = notification.IsAvailable
        };

        return toReturn;
    }

    public async Task<List<NotificationViewModel>> GetNotificationsForUserAsync(string userId, int take, int skip)
    {
        var notifications = await notificationRepository
            .AllAsNoTracking()
            .Include(x => x.Inviter)
            .Where(x => x.InviteeId == userId)
             .OrderByDescending(x => x.CreatedOn)
            .Skip(skip)
            .Take(take)
            .Select(x => new NotificationViewModel
            {
                Id = x.Id,
                Image = x.Inviter.ProfileImage.Id + x.Inviter.ProfileImage.ImageExtension,
                Name = x.Inviter.FirstName,
                Type = x.Event != null ? "event" : "profile",
                EventName = x.Event.Name,
                InviterUsername = x.Inviter.UserName
            })
            .ToListAsync();

        var toSee = notificationRepository
                    .All()
                    .Where(x => !x.IsSeen);

        foreach (var item in toSee)
        {
            item.IsSeen = true;
        }

        await notificationRepository.SaveChangesAsync();

        // TODO make it actually get the isAvailable. should be if you are invited to an event.
        return notifications
            .Select(x => new NotificationViewModel
            {
                Id = x.Id,
                EventName = x.EventName,
                Image = blobService.GetBlobUrl(x.Image, GlobalConstants.BlobPictures),
                Type = x.Type,
                Name = x.Name,
                InviterUsername = x.InviterUsername,
                Date = x.Date,
                EventId = x.EventId,
                IsAvailable = x.Type == "profile"
            })
            .ToList();
    }

    public async Task<bool> ChangeEventStatusAsync(string notificationId, ApplicationUser user, bool joinEvent)
    {
        var notification = await notificationRepository
            .All()
            .FirstOrDefaultAsync(x => x.Id == notificationId);

        if (notification.InviteeId != user.Id)
        {
            return false;
        }

        if (joinEvent)
        {
            var success = await eventService.JoinEventAsync(notification.EventId, user);
            if (!success)
            {
                return false;
            }
        }


        notification.IsAvailable = false;
        var updated = await notificationRepository.SaveChangesAsync();
        if (updated == 0)
        {
            return false;
        }

        return true;
    }

    public async Task<int> UnseenNotificationsAsync(string userId)
    {
        return await notificationRepository
            .AllAsNoTracking()
            .CountAsync(x => !x.IsSeen && x.InviteeId == userId);
    }

    public async Task<bool> SeeNotificationAsync(string userId, string notificationId)
    {
        var notification = await notificationRepository
            .All()
            .FirstOrDefaultAsync(x => x.InviteeId == userId && x.Id == notificationId);

        notification.IsSeen = true;
        return await notificationRepository.SaveChangesAsync() > 0;
    }

    public async Task<NotificationViewModel> CreateFriendRequestNotification(ApplicationUser inviter, string inviteeUsername)
    {
        var inviteeUser = userRepository.All().FirstOrDefault(x => x.UserName == inviteeUsername);

        var existingNotification = await notificationRepository
            .All()
            .FirstOrDefaultAsync(x => x.InviteeId == inviteeUser.Id &&
                                      x.InviterId == inviter.Id &&
                                      x.IsAvailable &&
                                      x.EventId == null);

        if (existingNotification != null)
        {
            return null;
        }

        var notification = new Notification
        {
            InviteeId = inviteeUser?.Id,
            InviterId = inviter.Id,
            CreatedOn = DateTime.UtcNow,
            IsAvailable = true
        };

        notification.ModifiedOn = notification.CreatedOn;

        notificationRepository.Add(notification);
        await notificationRepository.SaveChangesAsync();
        var toReturn = new NotificationViewModel
        {
            Id = notification.Id,
            Image = blobService.GetBlobUrl(inviter.ProfileImage.Id + inviter.ProfileImage.ImageExtension, GlobalConstants.BlobPictures),
            Name = inviter.FirstName,
            Type = "profile",
            EventName = inviter.FirstName + " " + inviter.LastName,
            InviterUsername = inviter.UserName,
            Date = notification.ModifiedOn,
        };

        return toReturn;
    }

    public async Task<bool> ChangeUserFriendNotificationStatus(string inviterId, string inviteeId)
    {
        var existingNotification = await notificationRepository
            .All()
            .FirstOrDefaultAsync(x => x.InviteeId == inviteeId &&
                                      x.InviterId == inviterId &&
                                      x.IsAvailable &&
                                      x.EventId == null);

        if (existingNotification == null)
        {
            return false;
        }

        existingNotification.IsAvailable = false;
        var result = await notificationRepository.SaveChangesAsync();
        return result > 0;
    }
}