using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Controllers
{
    [Route("post")]
    [ApiController]
    public class PostController : BaseController
    {
        private readonly IPostService postService;

        public PostController(IPostService postService)
        {
            this.postService = postService;
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
        public List<PersonListPopupViewModel> GetLikes(GetPostLikesCount dto)
        {
            return this.postService.GetPeopleLikes(dto.PostId, dto.Take, dto.Skip);
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
            var post = this.postService.GetPostByImageId(dto.ImageId, user.Id);
            if (post == null)
            {
                return BadRequest();
            }
            return Ok(post);
        }

    }
}
