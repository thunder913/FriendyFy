using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Data.Requests;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using FriendyFy.ViewModels;
using Microsoft.EntityFrameworkCore;
using ViewModels;
using static System.Decimal;

namespace FriendyFy.Services;

public class PostService : IPostService
{
    private IDeletableEntityRepository<Post> postRepository { get; }
    private IRepository<PostTagged> postTaggedRepository { get; }
    private IRepository<PostLike> postLikeRepository { get; }
    private IGeolocationService geolocationService { get; }
    private IBlobService blobService { get; }
    private IImageService imageService { get; }
    private IUserService userService { get; }

    public PostService(IDeletableEntityRepository<Post> postRepository,
        IBlobService blobService,
        IImageService imageService,
        IUserService userService,
        IRepository<PostLike> postLikeRepository,
        IGeolocationService geolocationService, IRepository<PostTagged> postTaggedRepository)
    {
        this.postRepository = postRepository;
        this.blobService = blobService;
        this.imageService = imageService;
        this.userService = userService;
        this.postLikeRepository = postLikeRepository;
        this.geolocationService = geolocationService;
        this.postTaggedRepository = postTaggedRepository;
    }

    public async Task<bool> CreatePostAsync(CreatePostRequest makePostDto, string userId)
    {
        var privacy = PrivacySettings.Private;
        if (makePostDto.PrivacySettings == "everyone")
        {
            privacy = PrivacySettings.Public;
        }
        var post = new Post
        {
            Privacy = privacy,
            Text = makePostDto.PostMessage,
            Latitude = makePostDto.LocationLat,
            Longitude = makePostDto.LocationLng,
            CreatedOn = DateTime.UtcNow,
            CreatorId = userId,
        };

        if (makePostDto.LocationLat != null && makePostDto.LocationLng != null)
        {
            post.LocationCity = geolocationService.GetUserLocation(ToDouble((decimal)makePostDto.LocationLat), ToDouble((decimal)makePostDto.LocationLng));
        }

        if (makePostDto.Image != null && !string.IsNullOrWhiteSpace(makePostDto.Image))
        {
            post.Image = await imageService.AddImageAsync(ImageType.NormalImage);
            await blobService.UploadBase64StringAsync(makePostDto.Image, post.Image?.Id + post.Image?.ImageExtension, GlobalConstants.BlobPictures);
        }
        foreach (var username in makePostDto.People)
        {
            var user = userService.GetByUsername(username).Id;
            var userTagged = new PostTagged
            {
                Post = post,
                UserId = user,
                CreatedOn = DateTime.UtcNow,
            };
            post.TaggedPeople.Add(userTagged);
        }
        postRepository.Add(post);
        await postRepository.SaveChangesAsync();

        return true;
    }

    public List<PostDetailsViewModel> GetAllPosts(string userId)
    {
        return postRepository
            .All()
            .OrderByDescending(x => x.CreatedOn)
            .Include(x => x.Creator)
            .ThenInclude(x => x.ProfileImage)
            .Include(x => x.Image)
            .Include(x => x.Likes)
            .Include(x => x.Comments)
            .Include(x => x.Reposts)
            .Include(x => x.TaggedPeople)
            .Include(x => x.Repost)
            .ThenInclude(x => x.Creator)
            .ThenInclude(x => x.ProfileImage)
            .Include(x => x.Repost)
            .ThenInclude(x => x.Image)
            .Include(x => x.Repost)
            .ThenInclude(x => x.Likes)
            .Include(x => x.Repost)
            .ThenInclude(x => x.Comments)
            .Include(x => x.Repost)
            .ThenInclude(x => x.Reposts)
            .Include(x => x.Repost)
            .ThenInclude(x => x.TaggedPeople)
            .ToList()
            .Select(x => new PostDetailsViewModel
            {
                PostId = x.Id,
                CommentsCount = x.Comments.Count(),
                CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                CreatorImage = blobService.GetBlobUrlAsync(x.Creator.ProfileImage?.Id + x.Creator.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                CreatorName = x.Creator.FirstName + " " + x.Creator.LastName,
                LikesCount = x.Likes.Count(),
                PostMessage = x.Text,
                RepostsCount = x.Reposts.Where(x => !x.IsDeleted).GroupBy(x => x.CreatorId).Count(),
                PostImage = blobService.GetBlobUrlAsync(x.Image?.Id + x.Image?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                IsLikedByUser = x.Likes.Any(x => x.LikedById == userId),
                Username = x.Creator.UserName,
                Latitude = x.Latitude ?? x.Latitude,
                Longitude = x.Longitude ?? x.Longitude,
                LocationCity = x.LocationCity,
                TaggedPeopleCount = x.TaggedPeople.Count(),
                PostType = PostType.Post.ToString(),
                IsRepost = x.IsRepost,
                IsUserCreator = x.CreatorId == userId,
                Repost = !x.IsRepost ? null : new PostDetailsViewModel
                {
                    PostId = x.Repost.Id,
                    CommentsCount = x.Repost.Comments.Count(),
                    CreatedAgo = (int)((DateTime.UtcNow - x.Repost.CreatedOn).TotalMinutes),
                    CreatorImage = blobService.GetBlobUrlAsync(x.Repost.Creator.ProfileImage?.Id + x.Repost.Creator.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    CreatorName = x.Repost.Creator.FirstName + " " + x.Repost.Creator.LastName,
                    LikesCount = x.Repost.Likes.Count(),
                    PostMessage = x.Repost.Text,
                    RepostsCount = x.Reposts.Where(x => !x.IsDeleted).GroupBy(x => x.CreatorId).Count(),
                    PostImage = blobService.GetBlobUrlAsync(x.Repost.Image?.Id + x.Repost.Image?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    IsLikedByUser = x.Repost.Likes.Any(y => y.LikedById == userId),
                    Username = x.Repost.Creator.UserName,
                    Latitude = x.Repost.Latitude ?? x.Repost.Latitude,
                    Longitude = x.Repost.Longitude ?? x.Repost.Longitude,
                    LocationCity = x.Repost.LocationCity,
                    TaggedPeopleCount = x.Repost.TaggedPeople.Count(),
                    PostType = PostType.Post.ToString(),
                }
            })
            .ToList();
    }

    public async Task<int?> LikePostAsync(string postId, ApplicationUser user)
    {
        var post = await postRepository
            .All()
            .Include(x => x.Likes)
            .FirstOrDefaultAsync(x => x.Id == postId);

        if (post == null)
        {
            return null;
        }

        var existingLike = post.Likes.FirstOrDefault(x => x.LikedById == user.Id);
        if (existingLike != null)
        {
            postLikeRepository.Delete(existingLike);
        }
        else
        {
            var postLike = new PostLike
            {
                CreatedOn = DateTime.Now,
                LikedBy = user,
                Post = post,
            };

            post.Likes.Add(postLike);
        }
        await postRepository.SaveChangesAsync();


        return post.Likes.Count;
    }

    public List<PersonListPopupViewModel> GetPeopleLikes(string postId, int take, int skip)
    {
        var peopleLiked = postLikeRepository
            .AllAsNoTracking()
            .Include(x => x.LikedBy)
            .ThenInclude(x => x.ProfileImage)
            .Where(x => x.PostId == postId)
            .OrderByDescending(x => x.CreatedOn)
            .Skip(skip)
            .Take(take)
            .ToList()
            .Select(x => new PersonListPopupViewModel
            {
                Name = x.LikedBy.FirstName + " " + x.LikedBy.LastName,
                Username = x.LikedBy.UserName,
                ProfileImage = blobService.GetBlobUrlAsync(x.LikedBy?.ProfileImage?.Id + x.LikedBy?.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
            })
            .ToList();

        return peopleLiked;
    }

    public List<PersonListPopupViewModel> GetTaggedPeople(string postId, int take, int skip)
    {
        return postTaggedRepository
            .AllAsNoTracking()
            .Where(x => x.PostId == postId)
            .Include(x => x.User)
            .ThenInclude(x => x.ProfileImage)
            .OrderByDescending(x => x.CreatedOn)
            .Skip(skip)
            .Take(take)
            .ToList()
            .Select(x => new PersonListPopupViewModel
            {
                Name = x.User.FirstName + " " + x.User.LastName,
                Username = x.User.UserName,
                ProfileImage = blobService.GetBlobUrlAsync(x.User?.ProfileImage?.Id + x.User?.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
            })
            .ToList();
    }

    public async Task<PostDetailsViewModel> GetPostByImageIdAsync(string imageId, string userId)
    {
        var post = await postRepository.AllAsNoTracking()
            .Include(x => x.Creator)
            .ThenInclude(x => x.ProfileImage)
            .Include(x => x.Image)
            .Include(x => x.Likes)
            .Include(x => x.Comments)
            .Include(x => x.Reposts)
            .Include(x => x.TaggedPeople)
            .FirstOrDefaultAsync(x => x.Image.Id == imageId && x.IsRepost == false);
            
        if (post == null)
        {
            return null;
        }

        var postDetailsViewModel = new PostDetailsViewModel
        {
            PostId = post.Id,
            CommentsCount = post.Comments.Count(),
            CreatedAgo = (int)((DateTime.UtcNow - post.CreatedOn).TotalMinutes),
            CreatorImage = blobService.GetBlobUrlAsync(post.Creator.ProfileImage?.Id + post.Creator.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
            CreatorName = post.Creator.FirstName + " " + post.Creator.LastName,
            LikesCount = post.Likes.Count(),
            PostMessage = post.Text,
            RepostsCount = post.Reposts.Count(x => !x.IsDeleted),
            PostImage = blobService.GetBlobUrlAsync(post.Image?.Id + post.Image?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
            IsLikedByUser = post.Likes.Any(x => x.LikedById == userId),
            Username = post.Creator.UserName,
            Latitude = post.Latitude ?? post.Latitude,
            Longitude = post.Longitude ?? post.Longitude,
            LocationCity = post.LocationCity,
            TaggedPeopleCount = post.TaggedPeople.Count(),
            PostType = PostType.Post.ToString(),
            IsRepost = false,
        };

        return postDetailsViewModel;
    }

    public async Task<int> RepostAsync(string id, string text, string userId)
    {
        var eventPost = new Post
        {
            CreatedOn = DateTime.UtcNow,
            CreatorId = userId,
            Text = text,
            IsRepost = true,
            RepostId = id
        };

        postRepository.Add(eventPost);
        var added = await postRepository.SaveChangesAsync();
        return postRepository.All()
            .Include(x => x.Reposts)
            .Where(x => !x.IsDeleted)
            .FirstOrDefault(x => x.Id == id)!
            .Reposts
            .GroupBy(x => x.CreatorId)
            .Count();
    }

    public List<PersonListPopupViewModel> GetPeopleReposts(string postId, int take, int skip)
    {
        return postRepository
            .AllAsNoTracking()
            .Include(x => x.Reposts)
            .ThenInclude(x => x.Creator)
            .ThenInclude(x => x.ProfileImage)
            .FirstOrDefault(x => x.Id == postId)?
            .Reposts
            .Where(x => !x.IsDeleted)
            .GroupBy(x => x.CreatorId)
            .Select(x => x.First())
            .OrderByDescending(x => x.CreatedOn)
            .Skip(skip)
            .Take(take)
            .ToList()
            .Select(x => new PersonListPopupViewModel
            {
                Name = x.Creator.FirstName + " " + x.Creator.LastName,
                Username = x.Creator.UserName,
                ProfileImage = blobService.GetBlobUrlAsync(x.Creator?.ProfileImage?.Id + x.Creator?.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
            })
            .ToList();
    }

    public async Task<bool> DeletePostAsync(string postId, string userId)
    {
        var post = await postRepository
            .All()
            .Include(x => x.Reposts)
            .FirstOrDefaultAsync(x => x.Id == postId && x.CreatorId == userId);
        if (post == null)
        {
            return false;
        }
        var reposts = post.Reposts;
        foreach (var eventPost in reposts)
        {
            postRepository.Delete(eventPost);
        }
        postRepository.Delete(post);
        var removed = await postRepository.SaveChangesAsync();
        return removed > 0;
    }

    public List<PostDetailsViewModel> GetFeedPosts(ApplicationUser user, bool isProfile, string userName, int take, int skip, List<string> ids)
    {
        var posts = new List<PostDetailsViewModel>();

        if (isProfile)
        {
            posts.AddRange(postRepository
                .All()
                .Where(x => x.Creator.UserName == userName)
                .Where(x => !ids.Contains(x.Id))
                .OrderByDescending(x => x.CreatedOn)
                .Take(take)
                .Select(x => new PostDetailsViewModel
                {
                    PostId = x.Id,
                    CommentsCount = x.Comments.Count(),
                    CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                    CreatorImage = x.Creator.ProfileImage.Id + x.Creator.ProfileImage.ImageExtension,
                    CreatorName = x.Creator.FirstName + " " + x.Creator.LastName,
                    LikesCount = x.Likes.Count(),
                    PostMessage = x.Text,
                    RepostsCount = x.Reposts.Where(x => !x.IsDeleted).GroupBy(x => x.CreatorId).Count(),
                    PostImage = x.Image.Id + x.Image.ImageExtension,
                    IsLikedByUser = user == null ? false : x.Likes.Any(x => x.LikedById == user.Id),
                    Username = x.Creator.UserName,
                    Latitude = x.Latitude ?? x.Latitude,
                    Longitude = x.Longitude ?? x.Longitude,
                    LocationCity = x.LocationCity,
                    TaggedPeopleCount = x.TaggedPeople.Count(),
                    PostType = PostType.Post.ToString(),
                    IsRepost = x.IsRepost,
                    IsUserCreator = user != null && x.CreatorId == user.Id,
                    Repost = !x.IsRepost ? null : new PostDetailsViewModel
                    {
                        PostId = x.Repost.Id,
                        CommentsCount = x.Repost.Comments.Count(),
                        CreatedAgo = (int)((DateTime.UtcNow - x.Repost.CreatedOn).TotalMinutes),
                        CreatorImage = x.Repost.Creator.ProfileImage.Id + x.Repost.Creator.ProfileImage.ImageExtension,
                        CreatorName = x.Repost.Creator.FirstName + " " + x.Repost.Creator.LastName,
                        LikesCount = x.Repost.Likes.Count(),
                        PostMessage = x.Repost.Text,
                        RepostsCount = x.Reposts.Where(x => !x.IsDeleted).GroupBy(x => x.CreatorId).Count(),
                        PostImage = x.Repost.Image.Id + x.Repost.Image.ImageExtension,
                        IsLikedByUser = user != null && x.Repost.Likes.Any(y => y.LikedById == user.Id),
                        Username = x.Repost.Creator.UserName,
                        Latitude = x.Repost.Latitude ?? x.Repost.Latitude,
                        Longitude = x.Repost.Longitude ?? x.Repost.Longitude,
                        LocationCity = x.Repost.LocationCity,
                        TaggedPeopleCount = x.Repost.TaggedPeople.Count(),
                        PostType = PostType.Post.ToString(),
                    }
                })
                .ToList());
        }
        else
        {
            posts.AddRange(postRepository
                .All()
                .Where(x => user == null || x.CreatorId != user.Id)
                .Where(x => !ids.Contains(x.Id))
                .OrderByDescending(x => EF.Functions.DateDiffSecond(DateTime.UtcNow, x.CreatedOn) / 1000.0 +
                                        ((user != null ? x.Creator.Friends.Count(y => y.Id == user.Id) * 1000 : 0) +
                                         (user != null ? x.Creator.Friends.Count(y => y.Id == user.Id) * 100000 : 0)))
                .Take(take)
                .Select(x => new PostDetailsViewModel
                {
                    PostId = x.Id,
                    CommentsCount = x.Comments.Count(),
                    CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                    CreatorImage = x.Creator.ProfileImage.Id + x.Creator.ProfileImage.ImageExtension,
                    CreatorName = x.Creator.FirstName + " " + x.Creator.LastName,
                    LikesCount = x.Likes.Count(),
                    PostMessage = x.Text,
                    RepostsCount = x.Reposts.Where(x => !x.IsDeleted).GroupBy(x => x.CreatorId).Count(),
                    PostImage = x.Image.Id + x.Image.ImageExtension,
                    IsLikedByUser = x.Likes.Any(x => x.LikedById == user.Id),
                    Username = x.Creator.UserName,
                    Latitude = x.Latitude ?? x.Latitude,
                    Longitude = x.Longitude ?? x.Longitude,
                    LocationCity = x.LocationCity,
                    TaggedPeopleCount = x.TaggedPeople.Count(),
                    PostType = PostType.Post.ToString(),
                    IsRepost = x.IsRepost,
                    IsUserCreator = x.CreatorId == user.Id,
                    Repost = !x.IsRepost ? null : new PostDetailsViewModel
                    {
                        PostId = x.Repost.Id,
                        CommentsCount = x.Repost.Comments.Count(),
                        CreatedAgo = (int)((DateTime.UtcNow - x.Repost.CreatedOn).TotalMinutes),
                        CreatorImage = x.Repost.Creator.ProfileImage.Id + x.Repost.Creator.ProfileImage.ImageExtension,
                        CreatorName = x.Repost.Creator.FirstName + " " + x.Repost.Creator.LastName,
                        LikesCount = x.Repost.Likes.Count(),
                        PostMessage = x.Repost.Text,
                        RepostsCount = x.Reposts.Where(x => !x.IsDeleted).GroupBy(x => x.CreatorId).Count(),
                        PostImage = x.Repost.Image.Id + x.Repost.Image.ImageExtension,
                        IsLikedByUser = x.Repost.Likes.Any(y => y.LikedById == user.Id),
                        Username = x.Repost.Creator.UserName,
                        Latitude = x.Repost.Latitude ?? x.Repost.Latitude,
                        Longitude = x.Repost.Longitude ?? x.Repost.Longitude,
                        LocationCity = x.Repost.LocationCity,
                        TaggedPeopleCount = x.Repost.TaggedPeople.Count(),
                        PostType = PostType.Post.ToString(),
                    }
                })
                .ToList());
        }
        var toReturn = posts.Select(x => new PostDetailsViewModel
            {
                PostId = x.PostId,
                CommentsCount = x.CommentsCount,
                CreatedAgo = x.CreatedAgo,
                CreatorImage = blobService.GetBlobUrlAsync(x.CreatorImage, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                CreatorName = x.CreatorName,
                LikesCount = x.LikesCount,
                PostMessage = x.PostMessage,
                RepostsCount = x.RepostsCount,
                PostImage = blobService.GetBlobUrlAsync(x.PostImage, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                IsLikedByUser = x.IsLikedByUser,
                Username = x.Username,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                LocationCity = x.LocationCity,
                TaggedPeopleCount = x.TaggedPeopleCount,
                PostType = x.PostType,
                IsRepost = x.IsRepost,
                IsUserCreator = x.IsUserCreator,
                Repost = !x.IsRepost ? null : new PostDetailsViewModel
                {
                    PostId = x.Repost.PostId,
                    CommentsCount = x.Repost.CommentsCount,
                    CreatedAgo = x.Repost.CreatedAgo,
                    CreatorImage = blobService.GetBlobUrlAsync(x.Repost.CreatorImage, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    CreatorName = x.Repost.CreatorName,
                    LikesCount = x.Repost.LikesCount,
                    PostMessage = x.Repost.PostMessage,
                    RepostsCount = x.RepostsCount,
                    PostImage = blobService.GetBlobUrlAsync(x.Repost.PostImage, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    IsLikedByUser = x.Repost.IsLikedByUser,
                    Username = x.Repost.Username,
                    Latitude = x.Repost.Latitude,
                    Longitude = x.Repost.Longitude,
                    LocationCity = x.Repost.LocationCity,
                    TaggedPeopleCount = x.Repost.TaggedPeopleCount,
                    PostType = x.Repost.PostType,
                }
            })
            .ToList();

        return toReturn;
    }

}