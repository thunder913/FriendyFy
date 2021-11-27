using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Mapping;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Services
{
    public class EventService : IEventService
    {
        private readonly IGeolocationService geolocationService;
        private readonly IDeletableEntityRepository<Event> eventRepository;
        private readonly IBlobService blobService;
        private readonly IImageService imageService;

        public EventService(IGeolocationService geolocationService,
            IDeletableEntityRepository<Event> eventRepository,
            IBlobService blobService,
            IImageService imageService)
        {
            this.geolocationService = geolocationService;
            this.eventRepository = eventRepository;
            this.blobService = blobService;
            this.imageService = imageService;
        }

        public async Task CreateEventAsync(string name, DateTime date, List<Interest> interests, PrivacySettings privacySettings, decimal latitude, decimal longitude, bool isReocurring, ReocurringType reocurringType, string description, string profileImage, string organizerId)
        {
            var newEvent = new Event()
            {
                Name = name,
                Time = date,
                Interests = interests,
                PrivacySettings = privacySettings,
                Latitude = latitude,
                Longitude = longitude,
                Description = description,
                OrganizerId = organizerId,
                CreatedOn = DateTime.UtcNow,
                LocationCity = this.geolocationService.GetUserLocation(Decimal.ToDouble((decimal)latitude), Decimal.ToDouble((decimal)longitude))
            };
            if (profileImage != null && !string.IsNullOrWhiteSpace(profileImage))
            {
                newEvent.ProfileImage = await imageService.AddImageAsync(ImageType.NormalImage);
                await blobService.UploadBase64StringAsync(profileImage, newEvent.ProfileImage?.Id + newEvent.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures);
            }
            if (isReocurring)
            {
                newEvent.IsReocurring = true;
                newEvent.ReocurringType = reocurringType;
            }

            await this.eventRepository.AddAsync(newEvent);
            await this.eventRepository.SaveChangesAsync();
        }

        public async Task<EventPageViewModel> GetEventByIdAsync(string id, string userId)
        {
            var mapper = AutoMapperConfig.MapperInstance;
            var eventWithId = this.eventRepository
                .AllAsNoTracking()
                .Include(x => x.Interests)
                .Include(x => x.Users)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Organizer)
                .Include(x => x.Images)
                .Include(x => x.ProfileImage)
                .Select(x => new EventPageMapperDto()
                {
                    Id = x.Id,
                    City = x.LocationCity,
                    CreatedOn = x.CreatedOn,
                    Description = x.Description,
                    Interests = x.Interests.Select(y => new InterestViewModel()
                    {
                        Id = y.Id,
                        Label = y.Name,
                    })
                    .ToList(),
                    IsInEvent = x.Users.Any(y => y.Id == userId),
                    IsReocurring = x.IsReocurring,
                    Lat = x.Latitude,
                    Lng = x.Longitude,
                    Organizer = x.Organizer.FirstName + " " + x.Organizer.LastName,
                    OrganizerUsername = x.Organizer.UserName,
                    Privacy = x.PrivacySettings.ToString(),
                    ReocurringTime = x.ReocurringType.ToString(),
                    Time = x.Time,
                    Title = x.Name,
                    UserImages = x.Users.Select(y => y.ProfileImage.Id + y.ProfileImage.ImageExtension).ToList(),
                    Photos = x.Images.Select(y => y.Id + y.ImageExtension).ToList(),
                    MainPhoto = x.ProfileImage.Id + x.ProfileImage.ImageExtension
                })
                .FirstOrDefault(x => x.Id == id);

            var toReturn = mapper.Map<EventPageViewModel>(eventWithId);
            foreach (var item in eventWithId.UserImages)
            {
                toReturn.UserImages.Add(await this.blobService.GetBlobUrlAsync(item, GlobalConstants.BlobPictures));
            }
            foreach (var item in eventWithId.Photos)
            {
                toReturn.Photos.Add(await this.blobService.GetBlobUrlAsync(item, GlobalConstants.BlobPictures));
            }
            toReturn.MainPhoto = await this.blobService.GetBlobUrlAsync(eventWithId.MainPhoto, GlobalConstants.BlobPictures);

            return toReturn;
        }
    }
}
