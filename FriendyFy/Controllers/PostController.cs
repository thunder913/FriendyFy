using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

            return Json(new { success = await postService.CreatePostAsync(makePostDto, user.Id) });
        }

        [HttpGet("getPosts")]
        public IActionResult GetPosts()
        {
            return Json(this.postService.GetAllPosts());
        }
    }
}
