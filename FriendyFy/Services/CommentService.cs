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
using ViewModels;

namespace FriendyFy.Services;

public class CommentService : ICommentService
{
    private readonly IRepository<EventComment> eventCommentRepository;
    private readonly IRepository<EventPost> eventPostRepository;
    private readonly IDeletableEntityRepository<Post> postRepository;
    private readonly IRepository<PostComment> postCommentRepository;
    private readonly IRepository<CommentLike> commentLikeRepository;
    private readonly IBlobService blobService;
    private readonly IMapper mapper;

    public CommentService(IRepository<PostComment> postCommentRepository,
        IDeletableEntityRepository<Post> postRepository,
        IBlobService blobService,
        IRepository<CommentLike> commentLikeRepository,
        IRepository<EventComment> eventCommentRepository,
        IRepository<EventPost> eventPostRepository)
    {
        this.postCommentRepository = postCommentRepository;
        this.postRepository = postRepository;
        this.blobService = blobService;
        this.commentLikeRepository = commentLikeRepository;
        this.eventCommentRepository = eventCommentRepository;
        this.eventPostRepository = eventPostRepository;
        mapper = AutoMapperConfig.MapperInstance;
    }

    public async Task<PostCommentViewModel> AddCommentAsync(ApplicationUser user, string comment, string postId, PostType postType)
    {
        if (string.IsNullOrWhiteSpace(comment))
        {
            return null;
        }

        PostCommentViewModel viewModel;

        switch (postType)
        {
            case PostType.Post:
                {
                    var post = await postRepository.AllAsNoTracking().FirstOrDefaultAsync(x => x.Id == postId);

                    if (post == null)
                    {
                        return null;
                    }

                    var postComment = new PostComment
                    {
                        CommentedBy = user,
                        CreatedOn = DateTime.UtcNow,
                        PostId = postId,
                        Text = comment,
                    };

                    postCommentRepository.Add(postComment);
                    await postCommentRepository.SaveChangesAsync();

                    var dto = await GetCommentViewModelByIdAsync(postComment.Id, postType);

                    viewModel = mapper.Map<PostCommentViewModel>(dto);
                    viewModel.CommentorPicture = await blobService.GetBlobUrlAsync(dto.ProfilePicture, GlobalConstants.BlobPictures);
                    break;
                }
            case PostType.Event:
                {
                    var currEvent = await eventPostRepository
                        .AllAsNoTracking()
                        .FirstOrDefaultAsync(x => x.Id == postId);

                    if (currEvent == null)
                    {
                        return null;
                    }

                    var eventComment = new EventComment
                    {
                        CommentedBy = user,
                        CreatedOn = DateTime.UtcNow,
                        EventPostId = currEvent.Id,
                        Text = comment,
                    };

                    eventCommentRepository.Add(eventComment);
                    await eventCommentRepository.SaveChangesAsync();

                    var dto = await GetCommentViewModelByIdAsync(eventComment.Id, postType);

                    viewModel = mapper.Map<PostCommentViewModel>(dto);
                    viewModel.CommentorPicture = await blobService.GetBlobUrlAsync(dto.ProfilePicture, GlobalConstants.BlobPictures);
                    break;
                }
            default:
                return null;
        }

        return viewModel;
    }

    public List<PostCommentViewModel> GetCommentsForPost(string userId, string postId, int take, int skip, PostType postType)
    {
        return postType switch
        {
            PostType.Post => postRepository.AllAsNoTracking()
                .Include(x => x.Comments)
                .ThenInclude(x => x.CommentedBy)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Comments)
                .ThenInclude(x => x.CommentLikes)
                .FirstOrDefault(x => x.Id == postId)?
                .Comments.OrderByDescending(x => x.CreatedOn)
                .Skip(skip)
                .Take(take)
                .Select(x => new PostCommentViewModel
                {
                    CommentorUsername = x.CommentedBy.UserName,
                    CommentorName = x.CommentedBy.FirstName + " " + x.CommentedBy.LastName,
                    CommentorPicture =
                        blobService.GetBlobUrlAsync(
                                x.CommentedBy.ProfileImage?.Id + x.CommentedBy.ProfileImage?.ImageExtension,
                                GlobalConstants.BlobPictures)
                            .GetAwaiter()
                            .GetResult(),
                    CommentText = x.Text,
                    CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                    IsLikedByUser = x.CommentLikes.Any(y => y.LikedById == userId),
                    LikesCount = x.CommentLikes.Count(),
                    Id = x.Id,
                    PostType = postType.ToString(),
                })
                .ToList(),
            PostType.Event => eventPostRepository.AllAsNoTracking()
                .Include(x => x.Comments)
                .ThenInclude(x => x.CommentedBy)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Comments)
                .ThenInclude(x => x.CommentLikes)
                .FirstOrDefault(x => x.Id == postId)
                ?.Comments.OrderByDescending(x => x.CreatedOn)
                .Skip(skip)
                .Take(take)
                .Select(x => new PostCommentViewModel
                {
                    CommentorUsername = x.CommentedBy.UserName,
                    CommentorName = x.CommentedBy.FirstName + " " + x.CommentedBy.LastName,
                    CommentorPicture =
                        blobService.GetBlobUrlAsync(
                                x.CommentedBy.ProfileImage?.Id + x.CommentedBy.ProfileImage?.ImageExtension,
                                GlobalConstants.BlobPictures)
                            .GetAwaiter()
                            .GetResult(),
                    CommentText = x.Text,
                    CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                    IsLikedByUser = x.CommentLikes.Any(y => y.LikedById == userId),
                    LikesCount = x.CommentLikes.Count(),
                    Id = x.Id,
                    PostType = postType.ToString(),
                })
                .ToList(),
            _ => null
        };
    }

    public async Task<int?> LikeCommentAsync(string commentId, ApplicationUser user, PostType postType)
    {
        PostComment postComment = null;
        EventComment eventComment = null;
        CommentLike existingLike = null;

        switch (postType)
        {
            case PostType.Post:
                {
                    postComment = await postCommentRepository
                        .All()
                        .Include(x => x.CommentLikes)
                        .FirstOrDefaultAsync(x => x.Id == commentId);

                    if (postComment == null)
                    {
                        return null;
                    }
                    existingLike = postComment.CommentLikes.FirstOrDefault(x => x.LikedById == user.Id);
                    break;
                }
            case PostType.Event:
                {
                    eventComment = await eventCommentRepository
                        .All()
                        .Include(x => x.CommentLikes)
                        .FirstOrDefaultAsync(x => x.Id == commentId);

                    if (eventComment == null)
                    {
                        return null;
                    }

                    existingLike = eventComment.CommentLikes.FirstOrDefault(x => x.LikedById == user.Id);
                    break;
                }
        }

        if (existingLike != null)
        {
            commentLikeRepository.Delete(existingLike);
        }
        else
        {
            var commentLike = new CommentLike
            {
                CreatedOn = DateTime.Now,
                LikedBy = user,
                Comment = postComment,
            };

            if (postType == PostType.Post)
            {
                postComment?.CommentLikes.Add(commentLike);
            }
            else
            {
                eventComment?.CommentLikes.Add(commentLike);
            }
        }
        await postCommentRepository.SaveChangesAsync();


        return postType == PostType.Post ? postComment?.CommentLikes.Count : eventComment?.CommentLikes.Count;
    }

    public async Task<List<PersonListPopupViewModel>> GetPeopleLikesAsync(string commentId, int take, int skip)
    {
        var peopleLikedDto = await commentLikeRepository
            .AllAsNoTracking()
            .Include(x => x.LikedBy)
            .ThenInclude(x => x.ProfileImage)
            .Where(x => x.CommentId == commentId || x.EventCommentId == commentId)
            .OrderByDescending(x => x.CreatedOn)
            .Skip(skip)
            .Take(take)
            .Select(x => new PersonLikeDto()
            {
                UserName = x.LikedBy.UserName,
                FirstName = x.LikedBy.FirstName,
                LastName = x.LikedBy.LastName,
                ProfilePicture = x.LikedBy.ProfileImage.Id + x.LikedBy.ProfileImage.ImageExtension,
            })
            .ToListAsync();

        var viewModel = peopleLikedDto.Select(x =>
        {
            var viewModel = mapper.Map<PersonLikeDto, PersonListPopupViewModel>(x);
            viewModel.ProfileImage = blobService.GetBlobUrlAsync(x.ProfilePicture, GlobalConstants.BlobPictures).GetAwaiter().GetResult();
            return viewModel;
        }).ToList();

        return viewModel;
    }

    private async Task<PostCommentDto> GetCommentViewModelByIdAsync(string commentId, PostType postType)
    {
        return postType switch
        {
            PostType.Post => await postCommentRepository.AllAsNoTracking()
                .Include(x => x.CommentedBy)
                .ThenInclude(x => x.ProfileImage)
                .Where(x => x.Id == commentId)?
                .Select(x => new PostCommentDto()
                {
                    UserName = x.CommentedBy.UserName,
                    Name = x.CommentedBy.FirstName + " " + x.CommentedBy.LastName,
                    ProfilePicture = x.CommentedBy.ProfileImage.Id + x.CommentedBy.ProfileImage.ImageExtension,
                    CommentText = x.Text,
                    CreatedOn = x.CreatedOn,
                    IsLikedByUser = false,
                    LikesCount = x.CommentLikes.Count,
                    Id = x.Id,
                    PostType = postType.ToString()
                })
                .FirstOrDefaultAsync(),
            PostType.Event => await eventCommentRepository.AllAsNoTracking()
                .Include(x => x.CommentedBy)
                .ThenInclude(x => x.ProfileImage)
                .Where(x => x.Id == commentId)
                .Select(x => new PostCommentDto()
                {
                    UserName = x.CommentedBy.UserName,
                    Name = x.CommentedBy.FirstName + " " + x.CommentedBy.LastName,
                    ProfilePicture = x.CommentedBy.ProfileImage.Id + x.CommentedBy.ProfileImage.ImageExtension,
                    CommentText = x.Text,
                    CreatedOn = x.CreatedOn,
                    IsLikedByUser = false,
                    LikesCount = x.CommentLikes.Count,
                    Id = x.Id,
                    PostType = postType.ToString()
                })
                .FirstOrDefaultAsync(),
            _ => null
        };
    }

    public async Task<bool> DeleteCommentAsync(string userId, string commentId, PostType postType)
    {
        switch (postType)
        {
            case PostType.Event:
                {
                    var comment = await eventCommentRepository
                        .All()
                        .FirstOrDefaultAsync(x => x.Id == commentId && x.CommentedById == userId);

                    if (comment != null)
                    {
                        eventCommentRepository.Delete(comment);
                    }

                    break;
                }
            case PostType.Post:
                {
                    var comment = await postCommentRepository
                        .All()
                        .FirstOrDefaultAsync(x => x.Id == commentId && x.CommentedById == userId);

                    if (comment != null)
                    {
                        postCommentRepository.Delete(comment);
                    }

                    break;
                }
        }

        var removed = await postRepository.SaveChangesAsync();
        return removed > 0;
    }
}