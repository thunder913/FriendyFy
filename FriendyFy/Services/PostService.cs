using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Services
{
    public class PostService : IPostService
    {
        private IDeletableEntityRepository<Post> postRepository { get; set; }
        private IRepository<PostLike> postLikeRepository { get; set; }
        private IBlobService blobService { get; set; }
        private IImageService imageService { get; set; }
        private IUserService userService { get; set; }

        public PostService(IDeletableEntityRepository<Post> postRepository,
            IBlobService blobService,
            IImageService imageService,
            IUserService userService,
            IRepository<PostLike> postLikeRepository)
        {
            this.postRepository = postRepository;
            this.blobService = blobService;
            this.imageService = imageService;
            this.userService = userService;
            this.postLikeRepository = postLikeRepository;
        }

        public async Task<bool> CreatePostAsync(MakePostDto makePostDto, string userId)
        {
            var privacy = PrivacySettings.Private;
            if (makePostDto.PrivacySettings == "everyone")
            {
                privacy = PrivacySettings.Public;
            }
            var post = new Post()
            {
                Privacy = privacy,
                Text = makePostDto.PostMessage,
                Latitude = makePostDto.LocationLat,
                Longitude = makePostDto.LocationLng,
                CreatedOn = DateTime.UtcNow,
                CreatorId = userId,
            };

            if (makePostDto.Image != null && !string.IsNullOrWhiteSpace(makePostDto.Image))
            {
                post.Image = await imageService.AddImageAsync(ImageType.NormalImage);
                await blobService.UploadBase64StringAsync(makePostDto.Image, post.Image?.Id + post.Image?.ImageExtension, GlobalConstants.BlobPictures);
            }
            foreach (var username in makePostDto.People)
            {
                var user = this.userService.GetByUsername(username).Id;
                var userTagged = new PostTagged()
                {
                    Post = post,
                    UserId = user,
                    CreatedOn = DateTime.UtcNow,
                };
                post.TaggedPeople.Add(userTagged);
            }
            await this.postRepository.AddAsync(post);
            await this.postRepository.SaveChangesAsync();

            return true;
        }

        public List<PostDetailsDto> GetAllPosts(string userId)
        {
            return this.postRepository
                .All()
                .OrderByDescending(x => x.CreatedOn)
                .Include(x => x.Creator)
                .ThenInclude(x => x.ProfileImage)
                .Include(x => x.Image)
                .Include(x => x.Likes)
                .Include(x => x.Comments)
                .Include(x => x.Reposts)
                .ToList()
                .Select(x => new PostDetailsDto()
                {
                    PostId = x.Id,
                    CommentsCount = x.Comments.Count(),
                    CreatedAgo = (int)((DateTime.UtcNow - x.CreatedOn).TotalMinutes),
                    CreatorImage = this.blobService.GetBlobUrlAsync(x.Creator.ProfileImage?.Id + x.Creator.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    CreatorName = x.Creator.FirstName + " " + x.Creator.LastName,
                    LikesCount = x.Likes.Count(),
                    PostMessage = x.Text,
                    RepostsCount = x.Reposts.Count(),
                    PostImage = this.blobService.GetBlobUrlAsync(x.Image?.Id + x.Image?.ImageExtension, GlobalConstants.BlobPictures).GetAwaiter().GetResult(),
                    IsLikedByUser = x.Likes.Any(x => x.LikedById == userId)
                })
                .ToList();
        }

        public async Task<int?> LikePostAsync(string postId, ApplicationUser user)
        {
            var post = this.postRepository
                .All()
                .Include(x => x.Likes)
                .FirstOrDefault(x => x.Id == postId);

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
                var postLike = new PostLike()
                {
                    CreatedOn = DateTime.Now,
                    LikedBy = user,
                    Post = post,
                };

                post.Likes.Add(postLike);
            }
            await postRepository.SaveChangesAsync();


            return post.Likes.Count();
        }

        public List<PersonListPopupViewModel> GetPeopleLikes(string postId, int take, int skip)
        {
            var peopleLiked = this.postLikeRepository
                .AllAsNoTracking()
                .Include(x => x.LikedBy)
                .ThenInclude(x => x.ProfileImage)
                .Where(x => x.PostId == postId)
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
    }
}
