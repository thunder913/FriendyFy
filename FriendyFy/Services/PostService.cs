using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Data.Dtos;
using FriendyFy.Data.Requests;
using FriendyFy.Mapping;
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
    private readonly IDeletableEntityRepository<Post> postRepository;
    private readonly IRepository<PostTagged> postTaggedRepository;
    private readonly IRepository<PostLike> postLikeRepository;
    private readonly IGeolocationService geolocationService;
    private readonly IBlobService blobService;
    private readonly IImageService imageService;
    private readonly IUserService userService;
    private readonly IMapper mapper;

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
        mapper = AutoMapperConfig.MapperInstance;
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
            post.LocationCity = await geolocationService.GetUserLocationAsync(ToDouble((decimal)makePostDto.LocationLat), ToDouble((decimal)makePostDto.LocationLng));
        }

        if (makePostDto.Image != null && !string.IsNullOrWhiteSpace(makePostDto.Image))
        {
            post.Image = await imageService.AddImageAsync(ImageType.NormalImage);
            await blobService.UploadBase64StringAsync(makePostDto.Image, post.Image?.Id + post.Image?.ImageExtension, GlobalConstants.BlobPictures);
        }
        foreach (var username in makePostDto.People)
        {
            var user = (await userService.GetByUsernameAsync(username)).Id;
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
        var dtos = postRepository
            .All()
            .OrderByDescending(x => x.CreatedOn)
            .Select(x => new PostDetailsDto
            {
                PostId = x.Id,
                CommentsCount = x.Comments.Count,
                CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                CreatorImageName = x.Creator.ProfileImage.Id + x.Creator.ProfileImage.ImageExtension,
                CreatorName = x.Creator.FirstName + " " + x.Creator.LastName,
                LikesCount = x.Likes.Count,
                PostMessage = x.Text,
                RepostsCount = x.Reposts.Where(x => !x.IsDeleted).GroupBy(x => x.CreatorId).Count(),
                PostImageName = x.Image.Id + x.Image.ImageExtension,
                IsLikedByUser = x.Likes.Any(y => y.LikedById == userId),
                Username = x.Creator.UserName,
                Latitude = x.Latitude ?? x.Latitude,
                Longitude = x.Longitude ?? x.Longitude,
                LocationCity = x.LocationCity,
                TaggedPeopleCount = x.TaggedPeople.Count,
                PostType = PostType.Post.ToString(),
                IsRepost = x.IsRepost,
                IsUserCreator = x.CreatorId == userId,
                Repost = !x.IsRepost ? null : new PostDetailsDto
                {
                    PostId = x.Repost.Id,
                    CommentsCount = x.Repost.Comments.Count,
                    CreatedAgo = (int)((DateTime.UtcNow - x.Repost.CreatedOn).TotalMinutes),
                    CreatorImageName = x.Repost.Creator.ProfileImage.Id + x.Repost.Creator.ProfileImage.ImageExtension,
                    CreatorName = x.Repost.Creator.FirstName + " " + x.Repost.Creator.LastName,
                    LikesCount = x.Repost.Likes.Count,
                    PostMessage = x.Repost.Text,
                    RepostsCount = x.Reposts.Where(y => !y.IsDeleted).GroupBy(y => y.CreatorId).Count(),
                    PostImageName = x.Repost.Image.Id + x.Repost.Image.ImageExtension,
                    IsLikedByUser = x.Repost.Likes.Any(y => y.LikedById == userId),
                    Username = x.Repost.Creator.UserName,
                    Latitude = x.Repost.Latitude ?? x.Repost.Latitude,
                    Longitude = x.Repost.Longitude ?? x.Repost.Longitude,
                    LocationCity = x.Repost.LocationCity,
                    TaggedPeopleCount = x.Repost.TaggedPeople.Count,
                    PostType = PostType.Post.ToString(),
                }
            })
        .ToList();

        var viewModel = dtos
            .Select(MapToPostViewModel)
            .ToList();

        return viewModel;
    }

    public async Task<int?> LikePostAsync(string postId, string userId)
    {
        var post = await postRepository
            .All()
            .Include(x => x.Likes)
            .FirstOrDefaultAsync(x => x.Id == postId);

        if (post == null)
        {
            return null;
        }

        var existingLike = post.Likes.FirstOrDefault(x => x.LikedById == userId);
        if (existingLike != null)
        {
            postLikeRepository.Delete(existingLike);
        }
        else
        {
            var postLike = new PostLike
            {
                CreatedOn = DateTime.Now,
                LikedById = userId,
                Post = post,
            };

            post.Likes.Add(postLike);
        }
        await postRepository.SaveChangesAsync();


        return post.Likes.Count;
    }

    public async Task<List<PersonListPopupViewModel>> GetPeopleLikesAsync(string postId, int take, int skip)
    {
        var peopleLiked = await postLikeRepository
            .AllAsNoTracking()
            .Where(x => x.PostId == postId)
            .OrderByDescending(x => x.CreatedOn)
            .Skip(skip)
            .Take(take)
            .Select(x => new PersonPopUpDto
            {
                UserName = x.LikedBy.UserName,
                FirstName = x.LikedBy.FirstName,
                LastName = x.LikedBy.LastName,
                ProfilePictureName = x.LikedBy.ProfileImage.Id + x.LikedBy.ProfileImage.ImageExtension,
            })
            .ToListAsync();

        var viewModel = peopleLiked
            .Select(MapToPersonPopUp)
            .ToList();

        return viewModel;
    }

    public async Task<List<PersonListPopupViewModel>> GetTaggedPeopleAsync(string postId, int take, int skip)
    {
        var dtos = await postTaggedRepository
            .AllAsNoTracking()
            .Where(x => x.PostId == postId)
            .OrderByDescending(x => x.CreatedOn)
            .Skip(skip)
            .Take(take)
            .Select(x => new PersonPopUpDto
            {
                UserName = x.User.UserName,
                FirstName = x.User.FirstName,
                LastName = x.User.LastName,
                ProfilePictureName = x.User.ProfileImage.Id + x.User.ProfileImage.ImageExtension,
            })
            .ToListAsync();

        var viewModel = dtos
            .Select(MapToPersonPopUp)
            .ToList();

        return viewModel;
    }

    public async Task<PostDetailsViewModel> GetPostByImageIdAsync(string imageId, string userId)
    {
        var dto = await postRepository.AllAsNoTracking()
            .Where(x => x.IsRepost == false && x.Image.Id == imageId)
            .Select(x => new PostDetailsDto
            {
                PostId = x.Id,
                CommentsCount = x.Comments.Count,
                CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                CreatorImageName = x.Creator.ProfileImage.Id + x.Creator.ProfileImage.ImageExtension,
                CreatorName = x.Creator.FirstName + " " + x.Creator.LastName,
                LikesCount = x.Likes.Count,
                PostMessage = x.Text,
                RepostsCount = x.Reposts.GroupBy(y => y.CreatorId).Count(),
                PostImageName = x.Image.Id + x.Image.ImageExtension,
                IsLikedByUser = x.Likes.Any(y => y.LikedById == userId),
                Username = x.Creator.UserName,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                LocationCity = x.LocationCity,
                TaggedPeopleCount = x.TaggedPeople.Count,
                PostType = PostType.Post.ToString(),
                IsRepost = false
            })
            .FirstOrDefaultAsync();

        if (dto == null)
        {
            return null;
        }

        var viewModel = mapper.Map<PostDetailsViewModel>(dto);
        viewModel.CreatorImage = blobService.GetBlobUrl(dto.CreatorImageName, GlobalConstants.BlobPictures);
        viewModel.PostImage = blobService.GetBlobUrl(dto.PostImageName, GlobalConstants.BlobPictures);

        return viewModel;
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

        await postRepository.SaveChangesAsync();

        return postRepository.All()
            .Include(x => x.Reposts)
            .Where(x => !x.IsDeleted)
            .FirstOrDefault(x => x.Id == id)!
            .Reposts
            .GroupBy(x => x.CreatorId)
            .Count();
    }

    public async Task<List<PersonListPopupViewModel>> GetPeopleRepostsAsync(string postId, int take, int skip)
    {
        var data = await postRepository
            .AllAsNoTracking()
            .Include(x => x.Creator)
            .ThenInclude(x => x.ProfileImage)
            .Where(x => x.RepostId == postId && x.IsRepost)
            .GroupBy(x => x.CreatorId)
            .ToListAsync();

        var dtos = data
            .Select(x => x.First())
            .OrderByDescending(x => x.CreatedOn)
            .Skip(skip)
            .Take(take)
            .Select(x => new PersonPopUpDto
            {
                UserName = x.Creator.UserName,
                FirstName = x.Creator.FirstName,
                LastName = x.Creator.LastName,
                ProfilePictureName = x.Creator.ProfileImage.Id + x.Creator.ProfileImage.ImageExtension
            })
            .ToList();

        var viewModel = dtos
            .Select(MapToPersonPopUp)
            .ToList();

        return viewModel;
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

    public async Task<List<PostDetailsViewModel>> GetFeedPosts(ApplicationUser user, bool isProfile, string userName, int take, int skip, List<string> ids)
    {
        ids ??= new();

        var posts = new List<PostDetailsDto>();

        if (isProfile)
        {
            posts.AddRange(await postRepository
                .All()
                .Where(x => x.Creator.UserName == userName)
                .Where(x => !ids.Contains(x.Id))
                .OrderByDescending(x => x.CreatedOn)
                .Take(take)
                .Select(x => new PostDetailsDto
                {
                    PostId = x.Id,
                    CommentsCount = x.Comments.Count,
                    CreatedAgo = (int)(DateTime.UtcNow - x.CreatedOn).TotalMinutes,
                    CreatorImageName = x.Creator.ProfileImage.Id + x.Creator.ProfileImage.ImageExtension,
                    CreatorName = x.Creator.FirstName + " " + x.Creator.LastName,
                    LikesCount = x.Likes.Count,
                    PostMessage = x.Text,
                    RepostsCount = x.Reposts.Where(y => !y.IsDeleted).Select(y => y.CreatorId).Distinct().Count(),
                    PostImageName = x.Image.Id + x.Image.ImageExtension,
                    IsLikedByUser = user != null && x.Likes.Any(y => y.LikedById == user.Id),
                    Username = x.Creator.UserName,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,
                    LocationCity = x.LocationCity,
                    TaggedPeopleCount = x.TaggedPeople.Count,
                    IsRepost = x.IsRepost,
                    IsUserCreator = user != null && x.CreatorId == user.Id,
                    PostType = PostType.Post.ToString(),
                    Repost = !x.IsRepost ? null : new PostDetailsDto
                    {
                        PostId = x.Repost.Id,
                        CommentsCount = x.Repost.Comments.Count,
                        CreatedAgo = (int)(DateTime.UtcNow - x.Repost.CreatedOn).TotalMinutes,
                        CreatorImageName = x.Repost.Creator.ProfileImage.Id + x.Repost.Creator.ProfileImage.ImageExtension,
                        CreatorName = x.Repost.Creator.FirstName + " " + x.Repost.Creator.LastName,
                        LikesCount = x.Repost.Likes.Count,
                        PostMessage = x.Repost.Text,
                        RepostsCount = x.Reposts.Where(y => !y.IsDeleted).Select(y => y.CreatorId).Distinct().Count(),
                        PostImageName = x.Repost.Image.Id + x.Repost.Image.ImageExtension,
                        IsLikedByUser = user != null && x.Repost.Likes.Any(y => y.LikedById == user.Id),
                        Username = x.Repost.Creator.UserName,
                        Latitude = x.Repost.Latitude ?? x.Repost.Latitude,
                        Longitude = x.Repost.Longitude ?? x.Repost.Longitude,
                        LocationCity = x.Repost.LocationCity,
                        TaggedPeopleCount = x.Repost.TaggedPeople.Count,
                    }
                })
                .ToListAsync());
        }
        else
        {
            posts.AddRange(await postRepository
                .AllAsNoTracking()
                .Where(x => user == null || x.CreatorId != user.Id)
                .Where(x => !ids.Contains(x.Id))
                .Take(take)
                .Select(x => new PostDetailsDto
                {
                    PostId = x.Id,
                    CommentsCount = x.Comments.Count,
                    CreatedAgo = (int)(DateTime.UtcNow - x.CreatedOn).TotalMinutes,
                    CreatorImageName = x.Creator.ProfileImage.Id + x.Creator.ProfileImage.ImageExtension,
                    CreatorName = x.Creator.FirstName + " " + x.Creator.LastName,
                    LikesCount = x.Likes.Count,
                    PostMessage = x.Text,
                    RepostsCount = x.Reposts.Where(y => !y.IsDeleted).Select(y => y.CreatorId).Distinct().Count(),
                    PostImageName = x.Image.Id + x.Image.ImageExtension,
                    IsLikedByUser = x.Likes.Any(y => y.LikedById == user.Id),
                    Username = x.Creator.UserName,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,
                    LocationCity = x.LocationCity,
                    TaggedPeopleCount = x.TaggedPeople.Count,
                    IsRepost = x.IsRepost,
                    IsUserCreator = x.CreatorId == user.Id,
                    PostType = PostType.Post.ToString(),
                    Repost = !x.IsRepost ? null : new PostDetailsDto
                    {
                        PostId = x.Repost.Id,
                        CommentsCount = x.Repost.Comments.Count,
                        CreatedAgo = (int)(DateTime.UtcNow - x.Repost.CreatedOn).TotalMinutes,
                        CreatorImageName = x.Repost.Creator.ProfileImage.Id + x.Repost.Creator.ProfileImage.ImageExtension,
                        CreatorName = x.Repost.Creator.FirstName + " " + x.Repost.Creator.LastName,
                        LikesCount = x.Repost.Likes.Count,
                        PostMessage = x.Repost.Text,
                        RepostsCount = x.Reposts.Where(y => !y.IsDeleted).Select(y => y.CreatorId).Distinct().Count(),
                        PostImageName = x.Repost.Image.Id + x.Repost.Image.ImageExtension,
                        IsLikedByUser = x.Repost.Likes.Any(y => y.LikedById == user.Id),
                        Username = x.Repost.Creator.UserName,
                        Latitude = x.Repost.Latitude,
                        Longitude = x.Repost.Longitude,
                        LocationCity = x.Repost.LocationCity,
                        TaggedPeopleCount = x.Repost.TaggedPeople.Count,
                    }
                })
                .ToListAsync());
        }

        return
            posts
                .Select(MapToPostViewModel)
                .ToList();
    }


    private PostDetailsViewModel MapToPostViewModel(PostDetailsDto post)
    {
        var mapped = mapper.Map<PostDetailsViewModel>(post);

        if (post.Repost != null)
        {
            mapped.Repost = mapper.Map<PostDetailsViewModel>(post.Repost);
            mapped.Repost.PostImage = blobService.GetBlobUrl(post.Repost.PostImageName, GlobalConstants.BlobPictures);
            mapped.Repost.CreatorImage = blobService.GetBlobUrl(post.Repost.CreatorImageName, GlobalConstants.BlobPictures);
        }

        mapped.CreatorImage = blobService.GetBlobUrl(post.CreatorImageName, GlobalConstants.BlobPictures);
        mapped.PostImage = blobService.GetBlobUrl(post.PostImageName, GlobalConstants.BlobPictures);

        return mapped;
    }

    private PersonListPopupViewModel MapToPersonPopUp(PersonPopUpDto dto)
    {
        var viewModel = mapper.Map<PersonListPopupViewModel>(dto);
        viewModel.ProfileImage = blobService.GetBlobUrl(dto.ProfilePictureName, GlobalConstants.BlobPictures);
        return viewModel;
    }
}