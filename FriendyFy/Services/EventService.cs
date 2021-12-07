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
        private readonly IRepository<EventComment> eventCommentRepository;
        private readonly IRepository<CommentLike> commentLikeRepository;

        public EventService(IGeolocationService geolocationService,
            IDeletableEntityRepository<Event> eventRepository,
            IBlobService blobService,
            IImageService imageService,
            IRepository<EventLike> eventLikeRepository,
            IRepository<EventPost> eventPostRepository,
            IRepository<EventComment> eventCommentRepository,
            IRepository<CommentLike> commentLikeRepository)
        {
            this.geolocationService = geolocationService;
            this.eventRepository = eventRepository;
            this.blobService = blobService;
            this.imageService = imageService;
            this.eventLikeRepository = eventLikeRepository;
            this.eventPostRepository = eventPostRepository;
            this.eventCommentRepository = eventCommentRepository;
            this.commentLikeRepository = commentLikeRepository;
        }

        public async Task CreateEventAsync(string name, DateTime date, List<Interest> interests, PrivacySettings privacySettings, decimal latitude, decimal longitude, string description, string profileImage, string organizerId)
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
            //if (isReocurring)
            //{
            //    newEvent.IsReocurring = true;
            //    newEvent.ReocurringType = reocurringType;
            //}

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
                .Include(x => x.Repost)
                .ThenInclude(x => x.Creator)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Repost)
                .ThenInclude(x => x.Event)
                .ThenInclude(x => x.Users)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Repost)
                .ThenInclude(x => x.Likes)
                .Include(x => x.Repost)
                .ThenInclude(x => x.Comments)
                .Include(x => x.Repost)
                .ThenInclude(x => x.Repost )
                .Include(x => x.Repost)
                .ThenInclude(x => x.Event)
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
                    RepostsCount = x.Reposts.GroupBy(x => x.CreatorId).Count(),
                    CommentsCount = x.Comments.Count(),
                    EventIsReocurring = x.Event.IsReocurring,
                    EventReocurring = x.Event.ReocurringType.ToString(),
                    IsLikedByUser = x.Likes.Any(x => x.LikedById == userId),
                    PostId = x.EventId,
                    // get the id of the eventpost ^^
                    PostType = PostType.Event.ToString(),
                    IsRepost = x.IsRepost,
                    EventPostId = x.Id,
                    PostMessage = x.Text,
                    IsUserCreator = x.CreatorId == userId,
                    Repost = !x.IsRepost ? null : new PostDetailsViewModel()
                    {
                        Username = x.Repost.Creator.UserName,
                        CreatorName = x.Repost.Creator.FirstName + " " + x.Repost.Creator.LastName,
                        CreatedAgo = (int)((DateTime.UtcNow - x.Repost.CreatedOn).TotalMinutes),
                        CreatorImage = this.blobService.GetBlobUrlAsync(x.Repost.Creator.ProfileImage?.Id + x.Repost.Creator.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                        EventGoing = x.Repost.Event.Users.Select(y => this.blobService.GetBlobUrlAsync(y.ProfileImage?.Id + y.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult()).ToList(),
                        EventTitle = x.Repost.Event.Name,
                        EventInterests = x.Repost.Event.Interests.Select(y => new InterestViewModel()
                        {
                            Id = y.Id,
                            Label = y.Name,
                        }).ToList(),
                        LocationCity = x.Repost.Event.LocationCity,
                        Latitude = x.Repost.Event.Latitude,
                        Longitude = x.Repost.Event.Longitude,
                        EventTime = x.Repost.Event.Time,
                        LikesCount = x.Repost.Likes.Count(),
                        RepostsCount = x.Repost.Reposts.GroupBy(x => x.CreatorId).Count(),
                        CommentsCount = x.Repost.Comments.Count(),
                        EventIsReocurring = x.Repost.Event.IsReocurring,
                        EventReocurring = x.Repost.Event.ReocurringType.ToString(),
                        IsLikedByUser = x.Repost.Likes.Any(y => y.LikedById == userId),
                        PostId = x.Repost.EventId,
                        PostType = PostType.Event.ToString(),
                        EventPostId = x.RepostId,
                    }
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
                .Include(x => x.EventPost)
                .Include(x => x.LikedBy)
                .ThenInclude(x => x.ProfileImage)
                .Where(x => x.EventPost.Id == eventId)
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

        public async Task<bool> DeleteEventAsync(string eventId, string userId)
        {
            var currEvent = this.eventRepository
                .All()
                .Include(x => x.EventPosts)
                .FirstOrDefault(x => x.Id == eventId && x.OrganizerId == userId);
            if (currEvent == null)
            {
                return false;
            }
            var eventPosts = currEvent.EventPosts;
            foreach (var eventPost in eventPosts)
            {
                this.eventPostRepository.Delete(eventPost);
            }
            this.eventRepository.Delete(currEvent);
            var removed = await this.eventRepository.SaveChangesAsync();
            return removed > 0;
        }

        public List<SearchResultViewModel> GetEventSearchViewModel(string search, int take, int skip)
        {
            var searchWord = search.ToLower();

            var events = this.eventRepository
                .AllAsNoTracking()
                .Include(x => x.Interests)
                .Include(x => x.ProfileImage)
                .Where(x => x.Name.ToLower().Contains(searchWord)
                //|| x.Interests.Any(y => y.Name.ToLower().Contains(searchWord))
                || string.IsNullOrWhiteSpace(search))
                .OrderBy(x => x.Name)
                .Skip(skip)
                .Take(take)
                .Select(x => new
                {
                    Id = x.Id,
                    Image = x.ProfileImage.Id + x.ProfileImage.ImageExtension,
                    Name = x.Name,
                })
                .ToList();

            var toReturn = events.Select(x => new SearchResultViewModel()
            {
                Id = x.Id,
                ImageUrl = this.blobService.GetBlobUrlAsync(x.Image, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                Name = x.Name,
                Type = SearchResultType.@event.ToString()
            }).ToList();

            return toReturn;
        }

        public async Task<bool> RepostEventAsync(string id, string text, string userId)
        {
            var eventId = this.eventPostRepository
                .All()
                .FirstOrDefault(x => x.Id == id)
                .EventId;

            var eventPost = new EventPost()
            {
                CreatedOn = DateTime.UtcNow,
                CreatorId = userId,
                EventId = eventId,
                Text = text,
                IsRepost = true,
                RepostId = id
            };

            await this.eventPostRepository.AddAsync(eventPost);
            var added = await this.eventPostRepository.SaveChangesAsync();
            return added > 0;
        }

        public List<PersonListPopupViewModel> GetPostReposts(string eventId, int take, int skip)
        {
            return this.eventPostRepository
                .AllAsNoTracking()
                .Include(x => x.Reposts)
                .ThenInclude(x => x.Creator)
                .ThenInclude(x => x.ProfileImage)
                .FirstOrDefault(x => x.Id == eventId)
                .Reposts
                .GroupBy(x => x.CreatorId)
                .Select(x => x.First())
                .OrderByDescending(x => x.CreatedOn)
                .Skip(skip)
                .Take(take)
                .ToList()
                .Select(x =>  new PersonListPopupViewModel()
                {
                    Name = x.Creator.FirstName + " " + x.Creator.LastName,
                    Username = x.Creator.UserName,
                    ProfileImage = this.blobService.GetBlobUrlAsync(x.Creator?.ProfileImage?.Id + x.Creator?.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                })
                .ToList();
        }

        public async Task<bool> DeleteEventPostAsync(string postId, string userId)
        {
            var post = this.eventPostRepository
                .All()
                .Include(x => x.Comments)
                .ThenInclude(x => x.CommentLikes)
                .Include(x => x.Likes)
                .Include(x => x.Reposts)
                .ThenInclude(x => x.Comments)
                .ThenInclude(x => x.CommentLikes)
                .Include(x => x.Reposts)
                .ThenInclude(x => x.Likes)
                .FirstOrDefault(x => x.Id == postId && x.CreatorId == userId);
            if (post == null)
            {
                return false;
            }
            var reposts = post.Reposts;
            foreach (var eventPost in reposts)
            {
                foreach (var like in eventPost.Likes)
                {
                    this.eventLikeRepository.Delete(like);
                }
                foreach (var comment in eventPost.Comments)
                {
                    foreach (var like in comment.CommentLikes)
                    {
                        this.commentLikeRepository.Delete(like);
                    }
                    this.eventCommentRepository.Delete(comment);
                }
                this.eventPostRepository.Delete(eventPost);
            }
            foreach (var like in post.Likes)
            {
                this.eventLikeRepository.Delete(like);
            }
            foreach (var comment in post.Comments)
            {
                foreach (var like in comment.CommentLikes)
                {
                    this.commentLikeRepository.Delete(like);
                }
                this.eventCommentRepository.Delete(comment);
            }

            this.eventPostRepository.Delete(post);
            var removed = await this.eventPostRepository.SaveChangesAsync();
            return removed > 0;
        }

        public List<PostDetailsViewModel> GetFeedEvents(ApplicationUser user, bool isProfile, string userName, int take, int skip, List<string> ids)
        {
            var interests = new List<int>();
            if (user != null)
            {
                interests = user.Interests.Select(x => x.Id).ToList();
            }

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
                .Include(x => x.Repost)
                .ThenInclude(x => x.Creator)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Repost)
                .ThenInclude(x => x.Event)
                .ThenInclude(x => x.Users)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Repost)
                .ThenInclude(x => x.Likes)
                .Include(x => x.Repost)
                .ThenInclude(x => x.Comments)
                .Include(x => x.Repost)
                .ThenInclude(x => x.Repost)
                .Include(x => x.Repost)
                .ThenInclude(x => x.Event)
                .ThenInclude(x => x.Interests)
                .Where(x => (isProfile && x.Creator.UserName == userName) || (!isProfile && (user == null || x.CreatorId != user.Id)))
                .OrderByDescending(x => EF.Functions.DateDiffSecond(DateTime.UtcNow, x.CreatedOn)/1000.0 + 
                (user != null ? x.Event.Users.Count(y => y.Id == user.Id)*1000 : 0) +
                (user != null ? x.Event.Interests.Count(y => interests.Contains(y.Id))*1000 : 0))
                .Where(x => !ids.Contains(x.Id))
                .Skip(skip)
                .Take(take)
                // these queries can be a lot more optimal
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
                    RepostsCount = x.Reposts.GroupBy(x => x.CreatorId).Count(),
                    CommentsCount = x.Comments.Count(),
                    EventIsReocurring = x.Event.IsReocurring,
                    EventReocurring = x.Event.ReocurringType.ToString(),
                    IsLikedByUser = x.Likes.Any(x => x.LikedById == user.Id),
                    PostId = x.EventId,
                    PostType = PostType.Event.ToString(),
                    IsRepost = x.IsRepost,
                    EventPostId = x.Id,
                    PostMessage = x.Text,
                    IsUserCreator = x.CreatorId == user.Id,
                    Repost = !x.IsRepost ? null : new PostDetailsViewModel()
                    {
                        Username = x.Repost.Creator.UserName,
                        CreatorName = x.Repost.Creator.FirstName + " " + x.Repost.Creator.LastName,
                        CreatedAgo = (int)((DateTime.UtcNow - x.Repost.CreatedOn).TotalMinutes),
                        CreatorImage = this.blobService.GetBlobUrlAsync(x.Repost.Creator.ProfileImage?.Id + x.Repost.Creator.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                        EventGoing = x.Repost.Event.Users.Select(y => this.blobService.GetBlobUrlAsync(y.ProfileImage?.Id + y.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult()).ToList(),
                        EventTitle = x.Repost.Event.Name,
                        EventInterests = x.Repost.Event.Interests.Select(y => new InterestViewModel()
                        {
                            Id = y.Id,
                            Label = y.Name,
                        }).ToList(),
                        LocationCity = x.Repost.Event.LocationCity,
                        Latitude = x.Repost.Event.Latitude,
                        Longitude = x.Repost.Event.Longitude,
                        EventTime = x.Repost.Event.Time,
                        LikesCount = x.Repost.Likes.Count(),
                        RepostsCount = x.Repost.Reposts.GroupBy(x => x.CreatorId).Count(),
                        CommentsCount = x.Repost.Comments.Count(),
                        EventIsReocurring = x.Repost.Event.IsReocurring,
                        EventReocurring = x.Repost.Event.ReocurringType.ToString(),
                        IsLikedByUser = x.Repost.Likes.Any(y => y.LikedById == user.Id),
                        PostId = x.Repost.EventId,
                        PostType = PostType.Event.ToString(),
                        EventPostId = x.RepostId,
                    }
                })
                .ToList();
        }
    }
}
