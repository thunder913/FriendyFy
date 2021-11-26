using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
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

        public EventService(IGeolocationService geolocationService,
            IDeletableEntityRepository<Event> eventRepository)
        {
            this.geolocationService = geolocationService;
            this.eventRepository = eventRepository;
        }

        public async Task CreateEventAsync(string name, DateTime date, List<Interest> interests, PrivacySettings privacySettings, decimal latitude, decimal longitude, bool isReocurring, ReocurringType reocurringType, string description, string organizerId)
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

            if (isReocurring)
            {
                newEvent.IsReocurring = true;
                newEvent.ReocurringType = reocurringType;
            }

            await this.eventRepository.AddAsync(newEvent);
            await this.eventRepository.SaveChangesAsync();
        }

        public EventPageViewModel GetEventById(string id, string userId)
        {
            return this.eventRepository
                .AllAsNoTracking()
                .Select(x => new EventPageViewModel()
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
                    //UserImages = x.Users.Select(y => y.ProfileImage.Id),

                })
                .FirstOrDefault(x => x.Id == id);
        }
    }
}
