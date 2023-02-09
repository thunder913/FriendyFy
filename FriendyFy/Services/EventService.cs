using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
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
using ViewModels;
using ViewModels.ViewModels;
using static System.Decimal;

namespace FriendyFy.Services;

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
    private readonly IUserService userService;
    private readonly IRepository<Notification> notificationRepository;
    private readonly IMapper mapper;
    public EventService(IGeolocationService geolocationService,
        IDeletableEntityRepository<Event> eventRepository,
        IBlobService blobService,
        IImageService imageService,
        IRepository<EventLike> eventLikeRepository,
        IRepository<EventPost> eventPostRepository,
        IRepository<EventComment> eventCommentRepository,
        IRepository<CommentLike> commentLikeRepository,
        IUserService userService,
        IRepository<Notification> notificationRepository)
    {
        this.geolocationService = geolocationService;
        this.eventRepository = eventRepository;
        this.blobService = blobService;
        this.imageService = imageService;
        this.eventLikeRepository = eventLikeRepository;
        this.eventPostRepository = eventPostRepository;
        this.eventCommentRepository = eventCommentRepository;
        this.commentLikeRepository = commentLikeRepository;
        this.userService = userService;
        this.notificationRepository = notificationRepository;
        mapper = AutoMapperConfig.MapperInstance;
    }

    public async Task CreateEventAsync(string name, DateTime date, List<Interest> interests, PrivacySettings privacySettings, decimal latitude, decimal longitude, string description, string profileImage, string organizerId)
    {
        var newEvent = new Event
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
            LocationCity = await geolocationService.GetUserLocationAsync(ToDouble(latitude), ToDouble(longitude))
        };
        
        if (profileImage != null && !string.IsNullOrWhiteSpace(profileImage))
        {
            newEvent.ProfileImage = await imageService.AddImageAsync(ImageType.NormalImage);
            await blobService.UploadBase64StringAsync(profileImage, newEvent.ProfileImage?.Id + newEvent.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures);
        }

        eventRepository.Add(newEvent);

        var eventPost = new EventPost
        {
            CreatedOn = DateTime.UtcNow,
            CreatorId = organizerId,
            EventId = newEvent.Id
        };
        eventPostRepository.Add(eventPost);
        await eventRepository.SaveChangesAsync();
    }

    public async Task<EventPageViewModel> GetEventByIdAsync(string id, string userId)
    {
        var mapper = AutoMapperConfig.MapperInstance;
        var eventWithId = await eventRepository
            .AllAsNoTracking()
            .Select(x => new EventPageMapperDto
            {
                Id = x.Id,
                City = x.LocationCity,
                CreatedOn = x.CreatedOn,
                Description = x.Description,
                Interests = x.Interests.Take(6).Select(y => new InterestViewModel
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
            .FirstOrDefaultAsync(x => x.Id == id);

        var toReturn = mapper.Map<EventPageViewModel>(eventWithId);
        foreach (var item in eventWithId.UserImages.Take(8))
        {
            toReturn.UserImages.Add(blobService.GetBlobUrl(item, GlobalConstants.BlobPictures));
        }
        
        toReturn.UserImages.Add(blobService.GetBlobUrl(eventWithId.OrganizerImageUrl, GlobalConstants.BlobPictures));
        foreach (var item in eventWithId.Photos.Take(3))
        {
            toReturn.Photos.Add(blobService.GetBlobUrl(item, GlobalConstants.BlobPictures));
        }
        
        toReturn.MainPhoto = blobService.GetBlobUrl(eventWithId.MainPhoto, GlobalConstants.BlobPictures);

        return toReturn;
    }

    public async Task<int?> LikeEventAsync(string eventId, string userId)
    {
        var currEvent = await eventPostRepository
            .All()
            .Include(x => x.Likes)
            .FirstOrDefaultAsync(x => x.Id == eventId);
        
        if (currEvent == null)
        {
            return null;
        }

        var existingLike = currEvent.Likes.FirstOrDefault(x => x.LikedById == userId);
        if (existingLike != null)
        {
            eventLikeRepository.Delete(existingLike);
        }
        else
        {
            var eventLike = new EventLike
            {
                CreatedOn = DateTime.Now,
                LikedById = userId,
                EventPost = currEvent,
            };

            currEvent.Likes.Add(eventLike);
        }
        await eventRepository.SaveChangesAsync();


        return currEvent.Likes.Count;
    }

    public async Task<List<PersonListPopupViewModel>> GetPeopleLikesAsync(string eventId, int take, int skip)
    {
        var peopleLiked = await eventLikeRepository
            .AllAsNoTracking()
            .Where(x => x.EventPost.Id == eventId)
            .OrderByDescending(x => x.CreatedOn)
            .Skip(skip)
            .Take(take)
            .Select(x => new PersonPopUpDto
            {
                FirstName = x.LikedBy.FirstName,
                LastName = x.LikedBy.LastName,
                UserName = x.LikedBy.UserName,
                ProfilePictureName = x.LikedBy.ProfileImage.Id + x.LikedBy.ProfileImage.ImageExtension
            })
            .ToListAsync();

        var toReturn = peopleLiked
            .Select(x =>
            {
                var model = mapper.Map<PersonListPopupViewModel>(x);
                model.ProfileImage = blobService.GetBlobUrl(x.ProfilePictureName, GlobalConstants.BlobPictures);
                return model;
            })
            .ToList();

        return toReturn;
    }

    public async Task<bool> JoinEventAsync(string eventId, ApplicationUser user)
    {
        var currEvent = await eventRepository
            .All()
            .Include(x => x.Users)
            .FirstOrDefaultAsync(x => x.Id == eventId);
        
        if (currEvent == null)
        {
            return false;
        }

        currEvent.Users.Add(user);
        var added = await eventRepository.SaveChangesAsync();
        return added > 0;
    }

    public async Task<bool> CreateEventPostAsync(string eventId, string userId)
    {
        var currEvent = await eventRepository
            .All()
            .FirstOrDefaultAsync(x => x.Id == eventId);
        
        if (currEvent == null)
        {
            return false;
        }

        var eventPost = new EventPost
        {
            CreatedOn = DateTime.UtcNow,
            CreatorId = userId,
            Event = currEvent
        };

        eventPostRepository.Add(eventPost);
        var saved = await eventPostRepository.SaveChangesAsync();
        return saved > 0;
    }

    public async Task<List<NavigationEventViewModel>> GetAttendingEvents(string username)
    {
        return await GetEventsAsync(x => (x.Organizer.UserName == username || x.Users.Any(y => y.UserName == username)) && x.Time > DateTime.UtcNow);
    }

    public async Task<List<NavigationEventViewModel>> GetOrganizedEventsAsync(string username)
    {
        return await GetEventsAsync(x => x.Organizer.UserName == username && x.Time > DateTime.UtcNow);
    }

    public async Task<List<NavigationEventViewModel>> GetSuggestedEventsAsync(string username)
    {
        return await GetEventsAsync(x =>
            x.Organizer.UserName != username && x.Users.All(y => y.UserName != username) &&
            x.Time > DateTime.UtcNow);
    }

    public async Task<string> AddImageToEventAsync(string eventId, string userId, string image)
    {
        var currEvent = await eventRepository
            .All()
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == eventId && x.OrganizerId == userId);
        
        if (currEvent == null || currEvent.Images.Count >= 3)
        {
            return null;
        }

        string imageUrl = null;
        if (!string.IsNullOrWhiteSpace(image))
        {
            var addedImage = await imageService.AddImageAsync(ImageType.NormalImage);
            await blobService.UploadBase64StringAsync(image, addedImage?.Id + addedImage?.ImageExtension, GlobalConstants.BlobPictures);
            currEvent.Images.Add(addedImage);
            imageUrl = blobService.GetBlobUrl(addedImage?.Id + addedImage?.ImageExtension, GlobalConstants.BlobPictures);
        }

        var added = await eventRepository.SaveChangesAsync();
        
        return added > 0 ? imageUrl : null;
    }

    public async Task<bool> LeaveEventAsync(string eventId, string userId)
    {
        var currEvent = await eventRepository
            .All()
            .Include(x => x.Users)
            .FirstOrDefaultAsync(x => x.Id == eventId);

        var userInEvent = currEvent?.Users.FirstOrDefault(x => x.Id == userId);
        
        if (userInEvent == null)
        {
            return false;
        }

        currEvent.Users.Remove(userInEvent);
        var removed = await eventRepository.SaveChangesAsync();
        return removed > 0;
    }

    public async Task<bool> DeleteEventAsync(string eventId, string userId)
    {
        var currEvent = await eventRepository
            .All()
            .Include(x => x.EventPosts)
            .ThenInclude(x => x.Comments)
            .ThenInclude(x => x.CommentLikes)
            .Include(x => x.Notification)
            .Include(x => x.EventPosts)
            .ThenInclude(x => x.Likes)
            .FirstOrDefaultAsync(x => x.Id == eventId && x.OrganizerId == userId);

        if (currEvent == null)
        {
            return false;
        }
        var eventPosts = currEvent.EventPosts;
        
        foreach (var eventPost in eventPosts)
        {
            foreach (var like in eventPost.Likes)
            {
                eventLikeRepository.Delete(like);
            }

            foreach (var comment in eventPost.Comments)
            {
                foreach (var commentLike in comment.CommentLikes)
                {
                    commentLikeRepository.Delete(commentLike);
                }
                eventCommentRepository.Delete(comment);
            }
            eventPostRepository.Delete(eventPost);
        }

        foreach (var notification in currEvent.Notification)
        {
            notificationRepository.Delete(notification);
        }
        
        eventRepository.Delete(currEvent);
        
        var removed = await eventRepository.SaveChangesAsync();
        
        return removed > 0;
    }

    public async Task<List<SearchResultViewModel>> GetEventSearchViewModelAsync(string search, int take, int skip)
    {
        var searchWord = search.ToLower();

        var events = await eventRepository
            .AllAsNoTracking()
            .Where(x => x.Name.ToLower().Contains(searchWord)
                        || string.IsNullOrWhiteSpace(search))
            .OrderBy(x => x.Name)
            .Skip(skip)
            .Take(take)
            .Select(x => new
            {
                x.Id,
                Image = x.ProfileImage.Id + x.ProfileImage.ImageExtension,
                x.Name,
            })
            .ToListAsync();

        var toReturn = events.Select(x => new SearchResultViewModel
        {
            Id = x.Id,
            ImageUrl = blobService.GetBlobUrl(x.Image, GlobalConstants.BlobPictures),
            Name = x.Name,
            Type = SearchResultType.@event.ToString()
        }).ToList();

        return toReturn;
    }

    public async Task<int> RepostEventAsync(string id, string text, string userId)
    {
        var currEvent = await eventPostRepository
            .All()
            .Include(x => x.Reposts)
            .FirstOrDefaultAsync(x => x.Id == id);

        var eventPost = new EventPost
        {
            CreatedOn = DateTime.UtcNow,
            CreatorId = userId,
            EventId = currEvent.EventId,
            Text = text,
            IsRepost = true,
            RepostId = id
        };

        eventPostRepository.Add(eventPost);
        await eventPostRepository.SaveChangesAsync();
        return currEvent.Reposts.GroupBy(x => x.CreatorId).Count();
    }

    public List<PersonListPopupViewModel> GetPostReposts(string eventId, int take, int skip)
    {
        var userReposts = eventPostRepository
            .AllAsNoTracking()
            .Include(x => x.Reposts)
            .ThenInclude(x => x.Creator)
            .ThenInclude(x => x.ProfileImage)
            .FirstOrDefault(x => x.Id == eventId)?
            .Reposts
            .GroupBy(x => x.CreatorId)
            .Select(x => x.First())
            .OrderByDescending(x => x.CreatedOn)
            .Skip(skip)
            .Take(take)
            .Select(x => new PersonRepostDto
            {
                Name = x.Creator.FirstName + " " + x.Creator.LastName,
                UserName = x.Creator.UserName,
                ProfileImageName = x.Creator.ProfileImage.Id + x.Creator.ProfileImage.ImageExtension,
            })
            .ToList();

        var viewModel = userReposts
            .Select(x =>
            {
                var mapped = mapper.Map<PersonListPopupViewModel>(x);
                mapped.ProfileImage = blobService.GetBlobUrl(x.ProfileImageName, GlobalConstants.BlobPictures);
                
                return mapped;
            })
            .ToList();

        return viewModel;
    }

    public async Task<bool> DeleteEventPostAsync(string postId, string userId)
    {
        var post = await eventPostRepository
            .All()
            .Include(x => x.Comments)
            .ThenInclude(x => x.CommentLikes)
            .Include(x => x.Likes)
            .Include(x => x.Reposts)
            .ThenInclude(x => x.Comments)
            .ThenInclude(x => x.CommentLikes)
            .Include(x => x.Reposts)
            .ThenInclude(x => x.Likes)
            .FirstOrDefaultAsync(x => x.Id == postId && x.CreatorId == userId);
        
        if (post == null)
        {
            return false;
        }
        
        var reposts = post.Reposts;
        foreach (var eventPost in reposts)
        {
            foreach (var like in eventPost.Likes)
            {
                eventLikeRepository.Delete(like);
            }
            foreach (var comment in eventPost.Comments)
            {
                foreach (var like in comment.CommentLikes)
                {
                    commentLikeRepository.Delete(like);
                }
                eventCommentRepository.Delete(comment);
            }
            eventPostRepository.Delete(eventPost);
        }
        foreach (var like in post.Likes)
        {
            eventLikeRepository.Delete(like);
        }
        foreach (var comment in post.Comments)
        {
            foreach (var like in comment.CommentLikes)
            {
                commentLikeRepository.Delete(like);
            }
            eventCommentRepository.Delete(comment);
        }

        eventPostRepository.Delete(post);
        var removed = await eventPostRepository.SaveChangesAsync();
        return removed > 0;
    }

    public async Task<List<PostDetailsViewModel>> GetFeedEventsAsync(ApplicationUser user, bool isProfile, string userName, int take, int skip, List<string> ids)
    {
        ids ??= new();
        
        var events = new List<PostDetailsDto>();

        if (isProfile)
        {
            events.AddRange(await eventPostRepository
                .AllAsNoTracking()
                .Where(x => x.Creator.UserName == userName)
                .Where(x => !ids.Contains(x.Id))
                .OrderByDescending(x => x.CreatedOn)
                .Take(take)
                .Select(x => new PostDetailsDto()
                {
                    CreatedAgo = (int)(DateTime.UtcNow - x.CreatedOn).TotalMinutes,
                    PostId = x.EventId,
                    EventPostId = x.Id,
                    IsRepost = x.IsRepost,
                    PostMessage = x.Text,
                    IsUserCreator = user != null && x.CreatorId == user.Id,
                    Username = x.Creator.UserName,
                    CreatorName = x.Creator.FirstName + " " + x.Creator.LastName,
                    CreatorImageName = x.Creator.ProfileImage.Id + x.Creator.ProfileImage.ImageExtension,
                    EventImageName = x.Event.ProfileImage.Id + x.Event.ProfileImage.ImageExtension,
                    EventTitle = x.Event.Name,
                    EventInterests = x.Event.Interests.Select(y => new InterestViewModel
                    {
                        Id = y.Id,
                        Label = y.Name,
                    }).ToList(),
                    LocationCity = x.Event.LocationCity,
                    Latitude = x.Event.Latitude,
                    Longitude = x.Event.Longitude,
                    EventTime = x.Event.Time,
                    EventIsReocurring = x.Event.IsReocurring,
                    EventReocurring = x.Event.ReocurringType.ToString(),
                    IsLikedByUser = user == null ? false : x.Likes.Any(x => x.LikedById == user.Id),
                    RepostsCount = x.Reposts.GroupBy(x => x.CreatorId).Count(),
                    CommentsCount = x.Comments.Count,
                    LikesCount = x.Likes.Count,
                    PostType = PostType.Event.ToString(),
                    Repost = !x.IsRepost ? null : new PostDetailsDto
                    {
                        Username = x.Repost.Creator.UserName,
                        CreatorName = x.Repost.Creator.FirstName + " " + x.Repost.Creator.LastName,
                        CreatedAgo = (int)((DateTime.UtcNow - x.Repost.CreatedOn).TotalMinutes),
                        CreatorImageName = x.Repost.Creator.ProfileImage.Id + x.Repost.Creator.ProfileImage.ImageExtension,
                        LikesCount = x.Repost.Likes.Count,
                        RepostsCount = x.Repost.Reposts.GroupBy(x => x.CreatorId).Count(),
                        CommentsCount = x.Repost.Comments.Count,
                        IsLikedByUser = user != null && x.Repost.Likes.Any(y => y.LikedById == user.Id),
                        PostType = PostType.Event.ToString(),
                        EventPostId = x.RepostId,
                        EventImageName = x.Event.ProfileImage.Id + x.Event.ProfileImage.ImageExtension
                    }
                })
                .ToListAsync());
        }
        else
        {
            events.AddRange(await eventPostRepository
                .AllAsNoTracking()
                .Where(x => user == null || x.CreatorId != user.Id)
                .OrderByDescending(x => x.CreatedOn)
                .Where(x => !ids.Contains(x.Id))
                .Take(take)
                .Select(x => new PostDetailsDto
                {
                    CreatedAgo = (int)(DateTime.UtcNow - x.CreatedOn).TotalMinutes,
                    PostId = x.EventId,
                    EventPostId = x.Id,
                    IsRepost = x.IsRepost,
                    PostMessage = x.Text,
                    IsUserCreator = x.CreatorId == user.Id,
                    Username = x.Creator.UserName,
                    CreatorName = x.Creator.FirstName + " " + x.Creator.LastName,
                    CreatorImageName = x.Creator.ProfileImage.Id + x.Creator.ProfileImage.ImageExtension,
                    EventImageName = x.Event.ProfileImage.Id + x.Event.ProfileImage.ImageExtension,
                    EventTitle = x.Event.Name,
                    EventInterests = x.Event.Interests.Select(y => new InterestViewModel
                    {
                        Id = y.Id,
                        Label = y.Name,
                    }).ToList(),
                    LocationCity = x.Event.LocationCity,
                    Latitude = x.Event.Latitude,
                    Longitude = x.Event.Longitude,
                    EventTime = x.Event.Time,
                    EventIsReocurring = x.Event.IsReocurring,
                    EventReocurring = x.Event.ReocurringType.ToString(),
                    IsLikedByUser = x.Likes.Any(x => x.LikedById == user.Id),
                    RepostsCount = x.Reposts.GroupBy(x => x.CreatorId).Count(),
                    CommentsCount = x.Comments.Count,
                    LikesCount = x.Likes.Count,
                    PostType = PostType.Event.ToString(),
                    Repost = !x.IsRepost ? null : new PostDetailsDto
                    {
                        Username = x.Repost.Creator.UserName,
                        CreatorName = x.Repost.Creator.FirstName + " " + x.Repost.Creator.LastName,
                        CreatedAgo = (int)((DateTime.UtcNow - x.Repost.CreatedOn).TotalMinutes),
                        CreatorImageName = x.Repost.Creator.ProfileImage.Id + x.Repost.Creator.ProfileImage.ImageExtension,
                        LikesCount = x.Repost.Likes.Count,
                        RepostsCount = x.Repost.Reposts.GroupBy(x => x.CreatorId).Count(),
                        CommentsCount = x.Repost.Comments.Count,
                        IsLikedByUser = x.Repost.Likes.Any(y => y.LikedById == user.Id),
                        PostType = PostType.Event.ToString(),
                        EventPostId = x.RepostId,
                        EventImageName = x.Event.ProfileImage.Id + x.Event.ProfileImage.ImageExtension
                    }
                })
                .ToListAsync());
        }

        return events
            .Select(x =>
            {
                var mapped = mapper.Map<PostDetailsViewModel>(x);
                if (x.Repost != null)
                {
                    mapped.Repost = mapper.Map<PostDetailsViewModel>(x.Repost);
                    mapped.Repost.EventImage = blobService
                        .GetBlobUrl(x.Repost.EventImageName, GlobalConstants.BlobPictures);
                    mapped.Repost.CreatorImage = blobService
                        .GetBlobUrl(x.Repost.CreatorImageName, GlobalConstants.BlobPictures);
                }

                mapped.CreatorImage = blobService.GetBlobUrl(x.CreatorImageName, GlobalConstants.BlobPictures);
                mapped.EventImage = blobService.GetBlobUrl(x.EventImageName, GlobalConstants.BlobPictures);

                return mapped;
            })
            .ToList();
    }

    public async Task<List<SearchPageResultViewModel>> GetSearchPageEventsAsync(int skip, int take, string searchWord, List<int> interestIds, bool showOnlyUserEvents, DateTime eventDate, bool hasDate, string userId)
    {
        searchWord = searchWord.ToLower();

        var events = await eventRepository
            .AllAsNoTracking()
            .Where(x => (x.Name.ToLower().Contains(searchWord) || string.IsNullOrWhiteSpace(searchWord)))
            .Where(x => (interestIds.Count == 0) || (x.Interests.Count(y => interestIds.Contains(y.Id)) == interestIds.Count))
            .Where(x => !hasDate || (eventDate.Year == x.Time.Year && eventDate.Month == x.Time.Month && eventDate.Day == x.Time.Day))
            .Where(x => (showOnlyUserEvents == false) || (x.OrganizerId == userId))
            .OrderBy(x => x.Name)
            .Skip(skip)
            .Take(take)
            .Select(x => new
            {
                x.Id,
                Image = x.ProfileImage.Id + x.ProfileImage.ImageExtension,
                x.Name,
                Interests = x.Interests.Select(y => new InterestViewModel
                {
                    Id = y.Id,
                    Label = y.Name,
                }).ToList(),
            })
            .ToListAsync();

        var toReturn = events
            .Select(x => new SearchPageResultViewModel
            {
                Id = x.Id,
                ImageUrl = blobService.GetBlobUrl(x.Image, GlobalConstants.BlobPictures),
                Name = x.Name,
                Type = SearchResultType.@event.ToString(),
                Interests = x.Interests
            })
            .ToList();

        return toReturn;
    }

    public async Task<string> GetRandomEventIdAsync()
    {
        var randomEvent = await eventRepository
            .AllAsNoTracking()
            .Include(x => x.Users)
            .OrderBy(x => Guid.NewGuid().ToString())
            .FirstOrDefaultAsync();

        return randomEvent?.Id;
    }

    public async Task<List<PersonListPopupViewModel>> GetPeopleInviteDtoAsync(string eventId, int take, int skip, ApplicationUser user)
    {

        var currEvent = await eventRepository.All()
            .Include(x => x.Users)
            .FirstOrDefaultAsync(x => x.Id == eventId);

        var creatorId = currEvent.OrganizerId;

        var usersInEvent = currEvent
            .Users
            .Select(x => x.Id)
            .ToList();

        usersInEvent.Add(creatorId);

        var usersToInvite = user.Friends
            .Where(x => !usersInEvent.Any(y => y == x.FriendId))
            .Where(x => x.IsFriend)
            .OrderBy(x => x.FriendId)
            .Skip(skip)
            .Take(take)
            .Select(x => x.FriendId)
            .ToList();

        return await userService.GetInvitePeoplePopUpAsync(usersToInvite);
    }

    private async Task<List<NavigationEventViewModel>> GetEventsAsync(Expression<Func<Event, bool>> func)
    {
        const int count = 2;

        var result = await eventRepository
            .AllAsNoTracking()
            .Where(func)
            .OrderBy(x => x.Time)
            .Take(count)
            .Select(x => new EventDto
            {
                Interests = x.Interests.Take(6).Select(y => new InterestViewModel
                {
                    Id = y.Id,
                    Label = y.Name,
                }).ToList(),
                Id = x.Id,
                Location = x.LocationCity,
                Name = x.Name,
                Time = x.Time,
                GoingPhotosNames = x.Users.Select(y => y.ProfileImage.Id + y.ProfileImage.ImageExtension),
                OrganizerImageName = x.Organizer.ProfileImage.Id + x.Organizer.ProfileImage.ImageExtension,
                Latitude = x.Latitude,
                Longitude = x.Longitude
            })
            .ToListAsync();

        var toReturn = new List<NavigationEventViewModel>();
        foreach (var item in result)
        {
            var navigationEvent = mapper.Map<NavigationEventViewModel>(item);
            navigationEvent.GoingPhotos = item.GoingPhotosNames.Select(x =>
                blobService.GetBlobUrl(x, GlobalConstants.BlobPictures)).ToList();
            navigationEvent.GoingPhotos.Add(blobService.GetBlobUrl(item.OrganizerImageName, GlobalConstants.BlobPictures));

            toReturn.Add(navigationEvent);
        }

        return toReturn;
    }
}