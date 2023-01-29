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
using ViewModels;

namespace FriendyFy.Services
{
    public class CommentService : ICommentService
    {
        private readonly IRepository<EventComment> eventCommentRepository;
        private readonly IRepository<EventPost> eventPostRepository;
        private readonly IDeletableEntityRepository<Post> postRepository;
        private readonly IRepository<PostComment> postCommentRepository;
        private readonly IRepository<CommentLike> commentLikeRepository;
        private readonly IBlobService blobService;

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
        }

        public async Task<PostCommentViewModel> AddCommentAsync(ApplicationUser user, string comment, string postId, PostType postType)
        {
            if (string.IsNullOrWhiteSpace(comment))
            {
                return null;
            }

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

                    return GetCommentViewModelById(postComment.Id, postType);
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

                    return GetCommentViewModelById(eventComment.Id, postType);
                }
                default:
                    return null;
            }
        }

        public async Task<bool> RemoveCommentAsync(string commentId, string userId)
        {
            var comment = await postCommentRepository
                .All()
                .Include(x => x.Post)
                .ThenInclude(x => x.Creator)
                .FirstOrDefaultAsync(x => x.Id == commentId);
            
            if (comment.CommentedById != userId && comment.Post.CreatorId != userId)
            {
                return false;
            }

            postCommentRepository.Delete(comment);
            await postCommentRepository.SaveChangesAsync();
            return true;
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
            PostComment comment = null;
            EventComment eventComment = null;
            CommentLike existingLike = null;
            switch (postType)
            {
                case PostType.Post:
                {
                    comment = await postCommentRepository
                        .All()
                        .Include(x => x.CommentLikes)
                        .FirstOrDefaultAsync(x => x.Id == commentId);
                
                    if (comment == null)
                    {
                        return null;
                    }
                    existingLike = comment.CommentLikes.FirstOrDefault(x => x.LikedById == user.Id);
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
                    Comment = comment,
                };

                if (postType == PostType.Post)
                {
                    comment?.CommentLikes.Add(commentLike);
                }
                else
                {
                    eventComment?.CommentLikes.Add(commentLike);
                }
            }
            await postCommentRepository.SaveChangesAsync();


            return postType == PostType.Post ? comment?.CommentLikes.Count : eventComment?.CommentLikes.Count;
        }

        public List<PersonListPopupViewModel> GetPeopleLikes(string commentId, int take, int skip)
        {
            var peopleLiked = commentLikeRepository
                .AllAsNoTracking()
                .Include(x => x.LikedBy)
                .ThenInclude(x => x.ProfileImage)
                .Where(x => x.CommentId == commentId || x.EventCommentId == commentId)
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
        private PostCommentViewModel GetCommentViewModelById(string commentId, PostType postType)
        {
            return postType switch
            {
                PostType.Post => postCommentRepository.AllAsNoTracking()
                    .Include(x => x.CommentedBy)
                    .ThenInclude(x => x.ProfileImage)
                    .Where(x => x.Id == commentId)?
                    .ToList()
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
                        IsLikedByUser = false,
                        LikesCount = x.CommentLikes.Count(),
                        Id = x.Id,
                        PostType = postType.ToString()
                    })
                    .FirstOrDefault(),
                PostType.Event => eventCommentRepository.AllAsNoTracking()
                    .Include(x => x.CommentedBy)
                    .ThenInclude(x => x.ProfileImage)
                    .Where(x => x.Id == commentId)
                    ?.ToList()
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
                        IsLikedByUser = false,
                        LikesCount = x.CommentLikes.Count(),
                        Id = x.Id,
                        PostType = postType.ToString()
                    })
                    .FirstOrDefault(),
                _ => null
            };
        }

        public async Task<bool> DeleteCommentAsync(string userId, string commentId, PostType postType)
        {
            switch (postType)
            {
                case PostType.Event:
                {
                    var comment = eventCommentRepository.All()
                        .FirstOrDefault(x => x.Id == commentId && x.CommentedById == userId);
                    if (comment != null)
                    {
                        eventCommentRepository.Delete(comment);
                    }

                    break;
                }
                case PostType.Post:
                {
                    var comment = postCommentRepository.All()
                        .FirstOrDefault(x => x.Id == commentId && x.CommentedById == userId);
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
}
