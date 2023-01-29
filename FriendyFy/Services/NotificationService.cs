using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using Microsoft.EntityFrameworkCore;
using ViewModels.ViewModels;

namespace FriendyFy.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IRepository<Notification> notificationRepository;
        private readonly IDeletableEntityRepository<Event> eventRepository;
        private readonly IDeletableEntityRepository<ApplicationUser> userRepository;
        private readonly IBlobService blobService;
        private readonly IEventService eventService;

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
        }

        public async Task<NotificationViewModel> CreateNotificationAsync(ApplicationUser inviter, string inviteeUsername, string eventId)
        {
            var currEvent = eventRepository.AllAsNoTracking()
                .Include(x => x.Users)
                .Where(x => !x.Users.Any(y => y.UserName == inviteeUsername))
                .Select(x => new
                {
                    x.Id, x.Name
                })
               .FirstOrDefault(x => x.Id == eventId);

            var inviteeUser = userRepository.AllAsNoTracking().FirstOrDefault(x => x.UserName == inviteeUsername);

            if (currEvent == null || inviteeUser == null)
            {
                return null;
            }

            var existing = notificationRepository
                .All()
                .Include(x => x.Invitee)
                .Where(x => x.EventId == eventId && x.InviterId == inviter.Id && x.Invitee.UserName == inviteeUsername && x.IsAvailable)
                .FirstOrDefault();

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

            await notificationRepository.AddAsync(notification);
            await notificationRepository.SaveChangesAsync();
            var toReturn = new NotificationViewModel
            {
                Id = notification.Id,
                Image = blobService.GetBlobUrlAsync(inviter.ProfileImage.Id+inviter.ProfileImage.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
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

        public List<NotificationViewModel> GetNotificationsForUser(string userId, int take, int skip)
        {
            var notifications = notificationRepository
                .AllAsNoTracking()
                .Include(x => x.Inviter)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Event)
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
                    InviterUsername = x.Inviter.UserName,
                    Date = x.ModifiedOn,
                    EventId = x.EventId,
                    IsAvailable = x.IsAvailable
                })
                .ToList();

            var toSee = notificationRepository
                .All()
                .Where(x => !x.IsSeen)
                .Where(x => x.InviteeId == userId);

            foreach (var item in toSee)
            {
                item.IsSeen = true;
            }

            notificationRepository.SaveChangesAsync().GetAwaiter().GetResult();

            return notifications
                .Select(x => new NotificationViewModel
                {
                    Id = x.Id,
                    EventName = x.EventName,
                    Image = blobService.GetBlobUrlAsync(x.Image, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    Type = x.Type,
                    Name = x.Name,
                    InviterUsername = x.InviterUsername,
                    Date = x.Date,
                    EventId = x.EventId,
                    IsAvailable = x.IsAvailable
                })
                .ToList();
        }

        public async Task<bool> ChangeEventStatusAsync(string notificationId, ApplicationUser user, bool joinEvent)
        {
            var notification = notificationRepository
                .All()
                .FirstOrDefault(x => x.Id == notificationId);

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

        public int UnseenNotifications(string userId)
        {
            return notificationRepository
                .AllAsNoTracking()
                .Where(x => x.InviteeId == userId)
                .Where(x => !x.IsSeen)
                .Count();
        }
        
        public async Task<bool> SeeNotificationAsync(string userId, string notificationId)
        {
            var notification = notificationRepository
                .All()
                .FirstOrDefault(x => x.InviteeId == userId && x.Id == notificationId);

            notification.IsSeen = true;
            return await notificationRepository.SaveChangesAsync() > 0;
        }

        public async Task<NotificationViewModel> CreateFriendRequestNotification(ApplicationUser inviter, string inviteeUsername)
        {
            var inviteeUser = userRepository.All().FirstOrDefault(x => x.UserName == inviteeUsername);

            var existingNotificaiton = notificationRepository
                .All()
                .Where(x => x.InviteeId == inviteeUser.Id)
                .Where(x => x.InviterId == inviter.Id)
                .Where(x => x.IsAvailable)
                .Where(x => x.EventId == null)
                .FirstOrDefault();

            if (existingNotificaiton != null)
            {
                return null;
            }

            var notification = new Notification
            {
                InviteeId = inviteeUser.Id,
                InviterId = inviter.Id,
                CreatedOn = DateTime.UtcNow,
                IsAvailable = true
            };

            notification.ModifiedOn = notification.CreatedOn;

            await notificationRepository.AddAsync(notification);
            await notificationRepository.SaveChangesAsync();
            var toReturn = new NotificationViewModel
            {
                Id = notification.Id,
                Image = blobService.GetBlobUrlAsync(inviter.ProfileImage.Id + inviter.ProfileImage.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                Name = inviter.FirstName,
                Type = "profile",
                EventName = inviter.FirstName+" "+inviter.LastName,
                InviterUsername = inviter.UserName,
                Date = notification.ModifiedOn,
            };

            return toReturn;
        }

        public async Task<bool> ChangeUserFriendNotificationStatus(string inviterId, string inviteeId)
        {
            var existingNotificaiton = notificationRepository
                .All()
                .Where(x => x.InviteeId == inviteeId)
                .Where(x => x.InviterId == inviterId)
                .Where(x => x.IsAvailable)
                .Where(x => x.EventId == null)
                .FirstOrDefault();

            if (existingNotificaiton == null)
            {
                return false;
            }

            existingNotificaiton.IsAvailable = false;
            var result = await notificationRepository.SaveChangesAsync();
            return result > 0;
        }
    }
}
