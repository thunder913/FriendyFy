using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ViewModels;
using ViewModels.ViewModels;

namespace FriendyFy.Controllers
{
    [Route("post")]
    [ApiController]
    public class PostController : BaseController
    {
        private readonly IPostService postService;
        private readonly IEventService eventService;

        public PostController(IPostService postService,
            IEventService eventService)
        {
            this.postService = postService;
            this.eventService = eventService;
        }

        [HttpPost("make")]
        public async Task<IActionResult> MakePost(MakePostDto makePostDto)
        {
            var user = this.GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not signed in!");
            }
            else if (string.IsNullOrWhiteSpace(makePostDto.Image) && string.IsNullOrWhiteSpace(makePostDto.PostMessage))
            {
                return BadRequest("Something went wrong, try again!");
            }

            return Json(new { success = await postService.CreatePostAsync(makePostDto, user.Id) });
        }

        [HttpGet("getPosts")]
        public IActionResult GetPosts()
        {
            var user = this.GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not signed in!");
            }

            return Json(this.postService.GetAllPosts(user.Id));
        }

        [HttpPost("likePost")]
        public async Task<IActionResult> LikePost(LikePostDto likePostDto)
        {
            var user = this.GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not signed in!");
            }

            int? likes;
            try
            {
                likes = await this.postService.LikePostAsync(likePostDto.PostId, user);
            }
            catch (Exception)
            {
                return BadRequest("There was an error saving your like!");
            }

            if (likes != null)
            {
                return Ok(likes);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("getLikes")]
        public IActionResult GetLikes(GetPostLikesCount dto)
        {
            var parsed = Enum.TryParse(dto.PostType, out PostType postType);
            if (!parsed)
            {
                return BadRequest();
            }
            if (postType == PostType.Post)
            {
                return Ok(this.postService.GetPeopleLikes(dto.PostId, dto.Take, dto.Skip));
            }
            else
            {
                return Ok(this.eventService.GetPeopleLikes(dto.PostId, dto.Take, dto.Skip));
            }
        }

        [HttpPost("getReposts")]
        public IActionResult GetReposts(GetPostLikesCount dto)
        {
            var parsed = Enum.TryParse(dto.PostType, out PostType postType);
            if (!parsed)
            {
                return BadRequest();
            }
            if (postType == PostType.Post)
            {
                return Ok(this.postService.GetPeopleReposts(dto.PostId, dto.Take, dto.Skip));
            }
            else
            {
                return Ok(this.eventService.GetPostReposts(dto.PostId, dto.Take, dto.Skip));
            }
        }

        [HttpPost("getTaggedPeople")]
        public List<PersonListPopupViewModel> GetTaggedPeople(GetPostLikesCount dto)
        {
            return this.postService.GetTaggedPeople(dto.PostId, dto.Take, dto.Skip);
        }

        [HttpPost("getByImageId")]
        public IActionResult GetPostByImageId(GetByImageIdDto dto)
        {
            var user = this.GetUserByToken();

            var post = this.postService.GetPostByImageId(dto.ImageId, user != null ? user.Id : null);
            if (post == null)
            {
                return BadRequest();
            }
            return Ok(post);
        }

        [HttpPost("repost")]
        public async Task<IActionResult> Repost(RepostDto dto)
        {
            var parsed = Enum.TryParse(dto.Type, out PostType postType);
            if (!parsed)
            {
                return BadRequest("There was something wrong with the request!");
            }
            var user = this.GetUserByToken();
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            if (postType == PostType.Event)
            {
                var result = await this.eventService.RepostEventAsync(dto.PostId, dto.Text, user.Id);
                if (result > 0)
                {
                    return Ok(new { reposts = result });
                }
            }
            else if (postType == PostType.Post)
            {
                var result = await this.postService.RepostAsync(dto.PostId, dto.Text, user.Id);
                if (result > 0)
                {
                    return Ok(new { reposts = result });
                }
            }
            return BadRequest();
        }

        [HttpPost("deletePost")]
        public async Task<IActionResult> DeletePost(DeletePostDto dto)
        {
            var parsed = Enum.TryParse(dto.PostType, out PostType postType);
            if (!parsed)
            {
                return BadRequest("There was something wrong with the request!");
            }

            var user = this.GetUserByToken();
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            bool deleted = false;
            if (postType == PostType.Post)
            {
                deleted = await this.postService.DeletePostAsync(dto.PostId, user.Id);

            }
            else if (postType == PostType.Event)
            {
                deleted = await this.eventService.DeleteEventPostAsync(dto.PostId, user.Id);
            }
            
            if (deleted)
                return Ok(deleted);

            return BadRequest();
        }

        [HttpPost("getFeedPosts")]
        public IActionResult GetFeedPosts(GetFeedData dto)
        {
            var user = this.GetUserByToken();

            var data = new List<PostDetailsViewModel>();
            var events = new List<PostDetailsViewModel>();
            var posts = new List<PostDetailsViewModel>();
            var toTake = dto.Take / 2;
            
            if (dto.FeedType != "posts")
            {
                if (dto.HasEvents)
                {
                    events = this.eventService.GetFeedEvents(user, dto.isProfile, dto.Username, toTake, dto.EventIds.Count(), dto.EventIds);
                }
            }
            if (dto.FeedType != "events")
            {
                if (dto.HasPosts)
                {
                    posts = this.postService.GetFeedPosts(user, dto.isProfile, dto.Username, toTake, dto.PostIds.Count(), dto.PostIds);
                }
            }
            bool hasPosts = false, hasEvents = false;

            if (events.Count() == toTake)
            {
                hasEvents = true;
            }
            if (posts.Count() == toTake)
            {
                hasPosts = true;
            }

            data.AddRange(events);
            data.AddRange(posts);
            
            if (!dto.isProfile)
            {
                data = data.OrderBy(x => Guid.NewGuid()).ToList();
            }
            else
            {
                data = data.OrderBy(x => x.CreatedAgo).ToList();
            }
            return Ok(new FeedViewModel()
            {
                Posts = data,
                HasEvents = hasEvents,
                HasPosts = hasPosts
            });
        }
    }
}
