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
using ViewModels.ViewModels;

namespace FriendyFy.Services
{
    public class EventService : IEventService
    {
        private readonly IGeolocationService geolocationService;
        private readonly IDeletableEntityRepository<Event> eventRepository;
        private readonly IBlobService blobService;
        private readonly IImageService imageService;
        private readonly IRepository<EventLike> eventLikeRepository;
        private readonly IRepository<EventPost> eventPostRepository;

        public EventService(IGeolocationService geolocationService,
            IDeletableEntityRepository<Event> eventRepository,
            IBlobService blobService,
            IImageService imageService,
            IRepository<EventLike> eventLikeRepository,
            IRepository<EventPost> eventPostRepository)
        {
            this.geolocationService = geolocationService;
            this.eventRepository = eventRepository;
            this.blobService = blobService;
            this.imageService = imageService;
            this.eventLikeRepository = eventLikeRepository;
            this.eventPostRepository = eventPostRepository;
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

            var eventPost = new EventPost()
            {
                CreatedOn = DateTime.UtcNow,
                CreatorId = organizerId,
                EventId = newEvent.Id
            };
            await this.eventPostRepository.AddAsync(eventPost);
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
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Images)
                .Include(x => x.ProfileImage)
                .Select(x => new EventPageMapperDto()
                {
                    Id = x.Id,
                    City = x.LocationCity,
                    CreatedOn = x.CreatedOn,
                    Description = x.Description,
                    Interests = x.Interests.Take(6).Select(y => new InterestViewModel()
                    {
                        Id = y.Id,
                        Label = y.Name,
                    })
                    .ToList(),
                    IsInEvent = x.OrganizerId == userId || x.Users.Any(y => y.Id == userId),
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
                    MainPhoto = x.ProfileImage.Id + x.ProfileImage.ImageExtension,
                    IsOrganizer = x.Organizer.Id == userId,
                    OrganizerImageUrl = x.Organizer.ProfileImage.Id + x.Organizer.ProfileImage.ImageExtension
                })
                .FirstOrDefault(x => x.Id == id);
            var toReturn = mapper.Map<EventPageViewModel>(eventWithId);
            foreach (var item in eventWithId.UserImages.Take(8))
            {
                toReturn.UserImages.Add(await this.blobService.GetBlobUrlAsync(item, GlobalConstants.BlobPictures));
            }
            toReturn.UserImages.Add(await this.blobService.GetBlobUrlAsync(eventWithId.OrganizerImageUrl, GlobalConstants.BlobPictures));
            foreach (var item in eventWithId.Photos.Take(3))
            {
                toReturn.Photos.Add(await this.blobService.GetBlobUrlAsync(item, GlobalConstants.BlobPictures));
            }
            toReturn.MainPhoto = await this.blobService.GetBlobUrlAsync(eventWithId.MainPhoto, GlobalConstants.BlobPictures);

            return toReturn;
        }

        public List<PostDetailsViewModel> GetEvents(string userId)
        {
            return this.eventPostRepository
                .AllAsNoTracking()
                .OrderByDescending(x => x.CreatedOn)
                .Include(x => x.Creator)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Event)
                .ThenInclude(x => x.Users)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Likes)
                .Include(x => x.Comments)
                .Include(x => x.Reposts)
                .Include(x => x.Event)
                .ThenInclude(x => x.Interests)
                .ToList()
                .Select(x => new PostDetailsViewModel()
                {
                    Username = x.Creator.UserName,
                    CreatorName = x.Creator.FirstName + " " + x.Creator.LastName,
                    CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                    CreatorImage = this.blobService.GetBlobUrlAsync(x.Creator.ProfileImage?.Id + x.Creator.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    EventGoing = x.Event.Users.Select(y => this.blobService.GetBlobUrlAsync(y.ProfileImage?.Id + y.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult()).ToList(),
                    EventTitle = x.Event.Name,
                    EventInterests = x.Event.Interests.Select(y => new InterestViewModel()
                    {
                        Id = y.Id,
                        Label = y.Name,
                    }).ToList(),
                    LocationCity = x.Event.LocationCity,
                    Latitude = x.Event.Latitude,
                    Longitude = x.Event.Longitude,
                    EventTime = x.Event.Time,
                    LikesCount = x.Likes.Count(),
                    RepostsCount = x.Reposts.Count(),
                    CommentsCount = x.Comments.Count(),
                    EventIsReocurring = x.Event.IsReocurring,
                    EventReocurring = x.Event.ReocurringType.ToString(),
                    IsLikedByUser = x.Likes.Any(x => x.LikedById == userId),
                    PostId = x.EventId,
                    PostType = PostType.Event.ToString(),
                })
                .ToList();
        }

        public async Task<int?> LikeEventAsync(string eventId, ApplicationUser user)
        {
            var currEvent = this.eventPostRepository
                .All()
                .Include(x => x.Likes)
                .FirstOrDefault(x => x.Id == eventId);

            if (currEvent == null)
            {
                return null;
            }

            var existingLike = currEvent.Likes.FirstOrDefault(x => x.LikedById == user.Id);
            if (existingLike != null)
            {
                eventLikeRepository.Delete(existingLike);
            }
            else
            {
                var eventLike = new EventLike()
                {
                    CreatedOn = DateTime.Now,
                    LikedBy = user,
                    EventPost = currEvent,
                };

                currEvent.Likes.Add(eventLike);
            }
            await eventRepository.SaveChangesAsync();


            return currEvent.Likes.Count();
        }

        public List<PersonListPopupViewModel> GetPeopleLikes(string eventId, int take, int skip)
        {
            var peopleLiked = this.eventLikeRepository
                .AllAsNoTracking()
                .Include(x => x.LikedBy)
                .ThenInclude(x => x.ProfileImage)
                .Where(x => x.EventPostId == eventId)
                .OrderByDescending(x => x.CreatedOn)
                .Skip(skip)
                .Take(take)
                .ToList()
                .Select(x => new PersonListPopupViewModel()
                {
                    Name = x.LikedBy.FirstName + " " + x.LikedBy.LastName,
                    Username = x.LikedBy.UserName,
                    ProfileImage = this.blobService.GetBlobUrlAsync(x.LikedBy?.ProfileImage?.Id + x.LikedBy?.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                })
                .ToList();

            return peopleLiked;
        }

        public async Task<bool> JoinEventAsync(string eventId, ApplicationUser user)
        {
            var currEvent = this.eventRepository.All().Include(x => x.Users).FirstOrDefault(x => x.Id == eventId);
            if (currEvent == null)
            {
                return false;
            }

            currEvent.Users.Add(user);
            var added = await this.eventRepository.SaveChangesAsync();
            return added > 0;
        }

        public async Task<bool> CreateEventPostAsync(string eventId, string userId)
        {
            var currEvent = this.eventRepository.All().FirstOrDefault(x => x.Id == eventId);
            if (currEvent == null)
            {
                return false;
            }

            var eventPost = new EventPost()
            {
                CreatedOn = DateTime.UtcNow,
                CreatorId = userId,
                Event = currEvent
            };

            await this.eventPostRepository.AddAsync(eventPost);
            var saved = await this.eventPostRepository.SaveChangesAsync();
            return saved > 0;
        }

        public List<NavigationEventViewModel> GetAttendingEvents(string username)
        {
            var result = this.eventRepository
                .AllAsNoTracking()
                .Include(x => x.Organizer)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Users)
                .ThenInclude(x => x.ProfileImage)
                .Where(x => (x.Organizer.UserName == username || x.Users.Any(y => y.UserName == username)) && x.Time > DateTime.UtcNow)
                .OrderBy(x => x.Time)
                .Take(2)
                .Select(x => new
                {
                    Interests = x.Interests.Take(6).Select(y => new InterestViewModel()
                    {
                        Id = y.Id,
                        Label = y.Name,
                    }).ToList(),
                    Id = x.Id,
                    Location = x.LocationCity,
                    Name = x.Name,
                    Time = x.Time,
                    GoingPhotos = x.Users.Select(y => y.ProfileImage.Id + y.ProfileImage.ImageExtension),
                    OrganizerImage = x.Organizer.ProfileImage.Id + x.Organizer.ProfileImage.ImageExtension,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude
                })
                .ToList();

            var toReturn = new List<NavigationEventViewModel>();
            foreach (var item in result)
            {
                var navigationEvent = new NavigationEventViewModel()
                {
                    GoingPhotos = item.GoingPhotos.Select(x => this.blobService.GetBlobUrlAsync(x, GlobalConstants.BlobPictures).GetAwaiter().GetResult()).ToList(),
                    Id = item.Id,
                    Interests = item.Interests,
                    Location = item.Location,
                    Name = item.Name,
                    Time = item.Time,
                    Latitude = item.Latitude,
                    Longitude = item.Longitude
                };
                navigationEvent.GoingPhotos.Add(this.blobService.GetBlobUrlAsync(item.OrganizerImage, GlobalConstants.BlobPictures).GetAwaiter().GetResult());

                toReturn.Add(navigationEvent);
            }

            return toReturn;
        }

        public List<NavigationEventViewModel> GetOrganizedEvents(string username)
        {
            var result = this.eventRepository
                .AllAsNoTracking()
                .Include(x => x.Organizer)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Users)
                .ThenInclude(x => x.ProfileImage)
                .Where(x => x.Organizer.UserName == username && x.Time > DateTime.UtcNow)
                .OrderBy(x => x.Time)
                .Take(2)
                .Select(x => new
                {
                    Interests = x.Interests.Take(6).Select(y => new InterestViewModel()
                    {
                        Id = y.Id,
                        Label = y.Name,
                    }).ToList(),
                    Id = x.Id,
                    Location = x.LocationCity,
                    Name = x.Name,
                    Time = x.Time,
                    GoingPhotos = x.Users.Select(y => y.ProfileImage.Id + y.ProfileImage.ImageExtension),
                    OrganizerImage = x.Organizer.ProfileImage.Id + x.Organizer.ProfileImage.ImageExtension,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude
                })
                .ToList();

            var toReturn = new List<NavigationEventViewModel>();
            foreach (var item in result)
            {
                var navigationEvent = new NavigationEventViewModel()
                {
                    GoingPhotos = item.GoingPhotos.Select(x => this.blobService.GetBlobUrlAsync(x, GlobalConstants.BlobPictures).GetAwaiter().GetResult()).ToList(),
                    Id = item.Id,
                    Interests = item.Interests,
                    Location = item.Location,
                    Name = item.Name,
                    Time = item.Time,
                    Latitude = item.Latitude,
                    Longitude = item.Longitude
                };
                navigationEvent.GoingPhotos.Add(this.blobService.GetBlobUrlAsync(item.OrganizerImage, GlobalConstants.BlobPictures).GetAwaiter().GetResult());

                toReturn.Add(navigationEvent);
            }

            return toReturn;
        }

        public List<NavigationEventViewModel> GetSuggestedEvents(ApplicationUser user)
        {
            // todo add better suggesting
            var result = this.eventRepository
                .AllAsNoTracking()
                .Include(x => x.Organizer)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Interests)
                .Include(x => x.Users)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Users)
                .ThenInclude(x => x.Friends)
                .Where(x => x.Organizer.UserName != user.UserName && !x.Users.Any(y => y.UserName == user.UserName) && x.Time > DateTime.UtcNow)
                .Where(x => (x.Latitude < user.Latitude && x.Latitude + 5 > user.Latitude) || (x.Latitude - 5 < user.Latitude && x.Latitude > user.Latitude)
                && (x.Longitude < user.Longitude && x.Longitude + 5 > user.Longitude) || (x.Longitude - 5 < user.Longitude && x.Longitude > user.Longitude))
                .OrderBy(x => x.Time)
                .Take(2)
                .Select(x => new
                {
                    Interests = x.Interests.Take(6).Select(y => new InterestViewModel()
                    {
                        Id = y.Id,
                        Label = y.Name,
                    }).ToList(),
                    Id = x.Id,
                    Location = x.LocationCity,
                    Name = x.Name,
                    Time = x.Time,
                    GoingPhotos = x.Users.Select(y => y.ProfileImage.Id + y.ProfileImage.ImageExtension).ToList(), 
                    OrganizerImage = x.Organizer.ProfileImage.Id+x.Organizer.ProfileImage.ImageExtension,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude
                })
                .ToList();

            var toReturn = new List<NavigationEventViewModel>();
            foreach (var item in result)
            {
                var navigationEvent = new NavigationEventViewModel()
                {
                    GoingPhotos = item.GoingPhotos.Select(x => this.blobService.GetBlobUrlAsync(x, GlobalConstants.BlobPictures).GetAwaiter().GetResult()).ToList(),
                    Id = item.Id,
                    Interests = item.Interests,
                    Location = item.Location,
                    Name = item.Name,
                    Time = item.Time,
                    Latitude = item.Latitude,
                    Longitude = item.Longitude
                };
                navigationEvent.GoingPhotos.Add(this.blobService.GetBlobUrlAsync(item.OrganizerImage, GlobalConstants.BlobPictures).GetAwaiter().GetResult());

                toReturn.Add(navigationEvent);
            }

            return toReturn;
        }

        public async Task<string> AddImageToEventAsync(string eventId, string userId, string image)
        {
            var currEvent = this.eventRepository
                .All()
                .Include(x => x.Images)
                .FirstOrDefault(x => x.Id == eventId && x.OrganizerId == userId);
            if (currEvent == null || currEvent.Images.Count >= 3)
            {
                return null;
            }

            string imageUrl = null;
            if (!string.IsNullOrWhiteSpace(image))
            {
                var addedImage =  await imageService.AddImageAsync(ImageType.NormalImage);
                await blobService.UploadBase64StringAsync(image, addedImage?.Id + addedImage?.ImageExtension, GlobalConstants.BlobPictures);
                currEvent.Images.Add(addedImage);
                imageUrl = await this.blobService.GetBlobUrlAsync(addedImage?.Id + addedImage?.ImageExtension, GlobalConstants.BlobPictures);
            }

            var added = await this.eventRepository.SaveChangesAsync();
            if (added > 0)
            {
                return imageUrl;
            }
            return null;
        }

        public async Task<bool> LeaveEventAsync(string eventId, string userId)
        {
            var currEvent = this.eventRepository
                .All()
                .Include(x => x.Users)
                .FirstOrDefault(x => x.Id == eventId);
            if (currEvent == null)
            {
                return false;
            }

            var userInEvent = currEvent.Users.FirstOrDefault(x => x.Id == userId);
            if (userInEvent == null)
            {
                return false;
            }

            currEvent.Users.Remove(userInEvent);
            var removed = await this.eventRepository.SaveChangesAsync();
            return removed > 0;
        }
    }
}
