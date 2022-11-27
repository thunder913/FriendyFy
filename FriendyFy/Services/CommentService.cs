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

            if (postType == PostType.Post)
            {
                var post = this.postRepository.AllAsNoTracking().FirstOrDefault(x => x.Id == postId);

                if (post == null)
                {
                    return null;
                }

                var postComment = new PostComment()
                {
                    CommentedBy = user,
                    CreatedOn = DateTime.UtcNow,
                    PostId = postId,
                    Text = comment,
                };

                await this.postCommentRepository.AddAsync(postComment);
                await this.postCommentRepository.SaveChangesAsync();

                return this.GetCommentViewModelById(postComment.Id, postType);
            }
            else if (postType == PostType.Event)
            {
                var currEvent = this.eventPostRepository
                    .AllAsNoTracking()
                    .FirstOrDefault(x => x.Id == postId);
                if (currEvent == null)
                {
                    return null;
                }

                var eventComment = new EventComment()
                {
                    CommentedBy = user,
                    CreatedOn = DateTime.UtcNow,
                    EventPostId = currEvent.Id,
                    Text = comment,
                };

                await this.eventCommentRepository.AddAsync(eventComment);
                await this.eventCommentRepository.SaveChangesAsync();

                return this.GetCommentViewModelById(eventComment.Id, postType);
            }
            return null;
        }

        public async Task<bool> RemoveCommentAsync(string commentId, string userId)
        {
            var comment = this.postCommentRepository
                .All()
                .Include(x => x.Post)
                .ThenInclude(x => x.Creator)
                .FirstOrDefault(x => x.Id == commentId);

            if (comment.CommentedById != userId && comment.Post.CreatorId != userId)
            {
                return false;
            }

            this.postCommentRepository.Delete(comment);
            await this.postCommentRepository.SaveChangesAsync();
            return true;
        }

        public List<PostCommentViewModel> GetCommentsForPost(string userId, string postId, int take, int skip, PostType postType)
        {
            if (postType == PostType.Post)
            {
                return this.postRepository
                    .AllAsNoTracking()
                    .Include(x => x.Comments)
                    .ThenInclude(x => x.CommentedBy)
                    .ThenInclude(x => x.ProfileImage)
                    .Include(x => x.Comments)
                    .ThenInclude(x => x.CommentLikes)
                    .FirstOrDefault(x => x.Id == postId)?
                    .Comments
                    .OrderByDescending(x => x.CreatedOn)
                    .Skip(skip)
                    .Take(take)
                    .Select(x => new PostCommentViewModel()
                    {
                        CommentorUsername = x.CommentedBy.UserName,
                        CommentorName = x.CommentedBy.FirstName + " " + x.CommentedBy.LastName,
                        CommentorPicture = this.blobService.GetBlobUrlAsync(x.CommentedBy.ProfileImage?.Id + x.CommentedBy.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                        CommentText = x.Text,
                        CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                        IsLikedByUser = x.CommentLikes.Any(y => y.LikedById == userId),
                        LikesCount = x.CommentLikes.Count(),
                        Id = x.Id,
                        PostType = postType.ToString(),
                    })
                    .ToList();
            }
            else if(postType == PostType.Event)
            {
                return this.eventPostRepository
                    .AllAsNoTracking()
                    .Include(x => x.Comments)
                    .ThenInclude(x => x.CommentedBy)
                    .ThenInclude(x => x.ProfileImage)
                    .Include(x => x.Comments)
                    .ThenInclude(x => x.CommentLikes)
                    .FirstOrDefault(x => x.Id == postId)?
                    .Comments
                    .OrderByDescending(x => x.CreatedOn)
                    .Skip(skip)
                    .Take(take)
                    .Select(x => new PostCommentViewModel()
                    {
                        CommentorUsername = x.CommentedBy.UserName,
                        CommentorName = x.CommentedBy.FirstName + " " + x.CommentedBy.LastName,
                        CommentorPicture = this.blobService.GetBlobUrlAsync(x.CommentedBy.ProfileImage?.Id + x.CommentedBy.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                        CommentText = x.Text,
                        CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                        IsLikedByUser = x.CommentLikes.Any(y => y.LikedById == userId),
                        LikesCount = x.CommentLikes.Count(),
                        Id = x.Id,
                        PostType = postType.ToString(),
                    })
                    .ToList();
            }

            return null;
        }

        public async Task<int?> LikeCommentAsync(string commentId, ApplicationUser user, PostType postType)
        {
            PostComment comment = null;
            EventComment eventComment = null;
            CommentLike existingLike = null;
            if (postType == PostType.Post)
            {
                comment = this.postCommentRepository
                    .All()
                    .Include(x => x.CommentLikes)
                    .FirstOrDefault(x => x.Id == commentId);
                if (comment == null)
                {
                    return null;
                }
                existingLike = comment.CommentLikes.FirstOrDefault(x => x.LikedById == user.Id);

            }
            else if (postType == PostType.Event)
            {
                eventComment = this.eventCommentRepository
                    .All()
                    .Include(x => x.CommentLikes)
                    .FirstOrDefault(x => x.Id == commentId);
                if (eventComment == null)
                {
                    return null;
                }
                existingLike = eventComment.CommentLikes.FirstOrDefault(x => x.LikedById == user.Id);
            }

            if (existingLike != null)
            {
                commentLikeRepository.Delete(existingLike);
            }
            else
            {
                var commentLike = new CommentLike()
                {
                    CreatedOn = DateTime.Now,
                    LikedBy = user,
                    Comment = comment,
                };

                if (postType == PostType.Post)
                {
                    comment.CommentLikes.Add(commentLike);
                }
                else
                {
                    eventComment.CommentLikes.Add(commentLike);
                }
            }
            await postCommentRepository.SaveChangesAsync();


            return postType == PostType.Post ? comment.CommentLikes.Count() : eventComment.CommentLikes.Count();
        }

        public List<PersonListPopupViewModel> GetPeopleLikes(string commentId, int take, int skip)
        {
            var peopleLiked = this.commentLikeRepository
                .AllAsNoTracking()
                .Include(x => x.LikedBy)
                .ThenInclude(x => x.ProfileImage)
                .Where(x => x.CommentId == commentId || x.EventCommentId == commentId)
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
        private PostCommentViewModel GetCommentViewModelById(string commentId, PostType postType)
        {
            if (postType == PostType.Post)
            {
                return this.postCommentRepository
                    .AllAsNoTracking()
                    .Include(x => x.CommentedBy)
                    .ThenInclude(x => x.ProfileImage)
                    .Where(x => x.Id == commentId)?
                    .ToList()
                    .Select(x => new PostCommentViewModel()
                    {
                        CommentorUsername = x.CommentedBy.UserName,
                        CommentorName = x.CommentedBy.FirstName + " " + x.CommentedBy.LastName,
                        CommentorPicture = this.blobService.GetBlobUrlAsync(x.CommentedBy.ProfileImage?.Id + x.CommentedBy.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                        CommentText = x.Text,
                        CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                        IsLikedByUser = false,
                        LikesCount = x.CommentLikes.Count(),
                        Id = x.Id,
                        PostType = postType.ToString()
                    })
                    .FirstOrDefault();
            }
            else if (postType == PostType.Event)
            {
                return this.eventCommentRepository
                    .AllAsNoTracking()
                    .Include(x => x.CommentedBy)
                    .ThenInclude(x => x.ProfileImage)
                    .Where(x => x.Id == commentId)?
                    .ToList()
                    .Select(x => new PostCommentViewModel()
                    {
                        CommentorUsername = x.CommentedBy.UserName,
                        CommentorName = x.CommentedBy.FirstName + " " + x.CommentedBy.LastName,
                        CommentorPicture = this.blobService.GetBlobUrlAsync(x.CommentedBy.ProfileImage?.Id + x.CommentedBy.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                        CommentText = x.Text,
                        CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                        IsLikedByUser = false,
                        LikesCount = x.CommentLikes.Count(),
                        Id = x.Id,
                        PostType = postType.ToString()
                    })
                    .FirstOrDefault();
            }

            return null;
        }

        public async Task<bool> DeleteCommentAsync(string userId, string commentId, PostType postType)
        {
            if (postType == PostType.Event)
            {
                var comment = this.eventCommentRepository.All()
                    .FirstOrDefault(x => x.Id == commentId && x.CommentedById == userId);
                if (comment != null)
                {
                    this.eventCommentRepository.Delete(comment);
                }
            }
            else if(postType == PostType.Post)
            {
                var comment = this.postCommentRepository.All()
                    .FirstOrDefault(x => x.Id == commentId && x.CommentedById == userId);
                if (comment != null)
                {
                    this.postCommentRepository.Delete(comment);
                }
            }

            var removed = await this.postRepository.SaveChangesAsync();
            return removed > 0;
        }
    }
}
