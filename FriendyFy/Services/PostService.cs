using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using System;
using System.Threading.Tasks;

namespace FriendyFy.Services
{
    public class PostService : IPostService
    {
        private IDeletableEntityRepository<Post> postRepository { get; set; }
        private IBlobService blobService { get; set; }
        private IImageService imageService { get; set; }
        private IUserService userService { get; set; }

        public PostService(IDeletableEntityRepository<Post> postRepository,
            IBlobService blobService,
            IImageService imageService, 
            IUserService userService)
        {
            this.postRepository = postRepository;
            this.blobService = blobService;
            this.imageService = imageService;
            this.userService = userService;
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

            // figure out how to save the images
            if(makePostDto.Image != null && !string.IsNullOrWhiteSpace(makePostDto.Image))
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
    }
}
