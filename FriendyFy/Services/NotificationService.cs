using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ViewModels.ViewModels;

namespace FriendyFy.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IRepository<Notification> notificationRepository;
        private readonly IDeletableEntityRepository<Event> eventRepository;
        private readonly IDeletableEntityRepository<ApplicationUser> userRepository;
        private readonly IBlobService blobService;

        public NotificationService(IRepository<Notification> notificationRepository, 
            IDeletableEntityRepository<Event> eventRepository, 
            IDeletableEntityRepository<ApplicationUser> userRepository,
            IBlobService blobService)
        {
            this.notificationRepository = notificationRepository;
            this.eventRepository = eventRepository;
            this.userRepository = userRepository;
            this.blobService = blobService;
        }

        public async Task<NotificationViewModel> CreateNotificationAsync(ApplicationUser inviter, string inviteeUsername, string eventId)
        {
            var currEvent = this.eventRepository.AllAsNoTracking()
                .Select(x => new
                {
                    Id = x.Id,
                    Name = x.Name
                })
               .FirstOrDefault(x => x.Id == eventId);

            var inviteeUser = this.userRepository.AllAsNoTracking().FirstOrDefault(x => x.UserName == inviteeUsername);

            if (currEvent == null || inviteeUser == null)
            {
                return null;
            }

            var existing = this.notificationRepository
                .All()
                .Include(x => x.Invitee)
                .Where(x => x.EventId == eventId && x.InviterId == inviter.Id && x.Invitee.UserName == inviteeUsername)
                .FirstOrDefault();

            if (existing != null)
            {
                existing.ModifiedOn = DateTime.UtcNow;
                await this.notificationRepository.SaveChangesAsync();
                return new NotificationViewModel()
                {
                    Id = existing.Id,
                    Image = this.blobService.GetBlobUrlAsync(inviter.ProfileImage.Id + inviter.ProfileImage.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    Name = inviter.FirstName,
                    Type = "event",
                    EventName = currEvent.Name,
                    InviterUsername = inviter.UserName,
                    Date = existing.ModifiedOn,
                }; ;
            }

            var notification = new Notification()
            {
                EventId = eventId,
                InviteeId = inviteeUser.Id,
                InviterId = inviter.Id,
                CreatedOn = DateTime.UtcNow,
            };

            notification.ModifiedOn = notification.CreatedOn;

            await this.notificationRepository.AddAsync(notification);
            await this.notificationRepository.SaveChangesAsync();
            var toReturn = new NotificationViewModel()
            {
                Id = notification.Id,
                Image = this.blobService.GetBlobUrlAsync(inviter.ProfileImage.Id+inviter.ProfileImage.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                Name = inviter.FirstName,
                Type = "event",
                EventName = currEvent.Name,
                InviterUsername = inviter.UserName,
                Date = notification.ModifiedOn
            };

            return toReturn;
        }

        public List<NotificationViewModel> GetNotificationsForUser(string userId, int take, int skip)
        {
            var notifications = this.notificationRepository
                .AllAsNoTracking()
                .Include(x => x.Inviter)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Event)
                .Where(x => x.InviteeId == userId)
                .OrderByDescending(x => x.CreatedOn)
                .Skip(skip)
                .Take(take)
                .Select(x => new NotificationViewModel()
                {
                    Id = x.Id,
                    Image = x.Inviter.ProfileImage.Id + x.Inviter.ProfileImage.ImageExtension,
                    Name = x.Inviter.FirstName,
                    Type = x.Event != null ? "event" : "friend",
                    EventName = x.Event.Name,
                    InviterUsername = x.Inviter.UserName,
                    Date = x.ModifiedOn,
                })
                .ToList();

            return notifications
                .Select(x => new NotificationViewModel()
                {
                    Id = x.Id,
                    EventName = x.EventName,
                    Image = this.blobService.GetBlobUrlAsync(x.Image, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    Type = x.Type,
                    Name = x.Name,
                    InviterUsername = x.InviterUsername,
                    Date = x.Date,
                })
                .ToList();
        }
    }
}
