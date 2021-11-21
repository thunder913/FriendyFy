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
        private IDeletableEntityRepository<Post> postRepository { get; set; }
        private IRepository<PostComment> postCommentRepository { get; set; }
        private IRepository<CommentLike> commentLikeRepository { get; set; }
        private IBlobService blobService { get; set; }

        public CommentService(IRepository<PostComment> postCommentRepository, IDeletableEntityRepository<Post> postRepository, IBlobService blobService, IRepository<CommentLike> commentLikeRepository)
        {
            this.postCommentRepository = postCommentRepository;
            this.postRepository = postRepository;
            this.blobService = blobService;
            this.commentLikeRepository = commentLikeRepository;
        }

        public async Task<PostCommentViewModel> AddCommentAsync(ApplicationUser user, string comment, string postId)
        {
            if (string.IsNullOrWhiteSpace(comment))
            {
                return null;
            }

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

            return this.GetCommentViewModelById(postComment.Id);
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

        public List<PostCommentViewModel> GetCommentsForPost(string userId, string postId, int take, int skip)
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
                    CommentorName = x.CommentedBy.FirstName + " " + x.CommentedBy.LastName,
                    CommentorPicture = this.blobService.GetBlobUrlAsync(x.CommentedBy.ProfileImage?.Id + x.CommentedBy.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    CommentText = x.Text,
                    CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                    IsLikedByUser = x.CommentLikes.Any(y => y.LikedById == userId),
                    LikesCount = x.CommentLikes.Count(),
                    Id = x.Id
                })
                .ToList();
        }

        public async Task<int?> LikeCommentAsync(string commentId, ApplicationUser user)
        {
            var comment = this.postCommentRepository
                .All()
                .Include(x => x.CommentLikes)
                .FirstOrDefault(x => x.Id == commentId);

            if (comment == null)
            {
                return null;
            }

            var existingLike = comment.CommentLikes.FirstOrDefault(x => x.LikedById == user.Id);
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

                comment.CommentLikes.Add(commentLike);
            }
            await postCommentRepository.SaveChangesAsync();


            return comment.CommentLikes.Count();
        }

        private PostCommentViewModel GetCommentViewModelById(string commentId)
        {
            return this.postCommentRepository
                .AllAsNoTracking()
                .Include(x => x.CommentedBy)
                .ThenInclude(x => x.ProfileImage)
                .Where(x => x.Id == commentId)?
                .ToList()
                .Select(x => new PostCommentViewModel()
                {
                    CommentorName = x.CommentedBy.FirstName + " " + x.CommentedBy.LastName,
                    CommentorPicture = this.blobService.GetBlobUrlAsync(x.CommentedBy.ProfileImage?.Id + x.CommentedBy.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    CommentText = x.Text,
                    CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                    IsLikedByUser = false,
                    LikesCount = x.CommentLikes.Count(),
                    Id = x.Id
                })
                .FirstOrDefault();
        }
    }
}
