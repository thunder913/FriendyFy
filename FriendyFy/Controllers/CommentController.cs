using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Controllers
{
    [Route("comment")]
    [ApiController]
    public class CommentController : BaseController
    {
        private ICommentService commentService { get; set; }

        public CommentController(ICommentService commentService)
        {
            this.commentService = commentService;
        }

        [HttpPost("make")]
        public async Task<IActionResult> AddComment(AddCommentDto comment)
        {
            var user = this.GetUserByToken();
            if (user == null)
            {
                return Unauthorized("You are not signed in!");
            }

            var commentAdded = await this.commentService.AddCommentAsync(user, comment.Text, comment.PostId);
            if (commentAdded != null)
            {
                return Ok(commentAdded);
            }
            else
            {
                return BadRequest();
            };
        }

        [HttpPost]
        public List<PostCommentViewModel> GetPostComments([FromBody] GetCommentsDto commentDto)
        {
            var user = this.GetUserByToken();
            return this.commentService.GetCommentsForPost(user?.Id, commentDto.PostId, commentDto.Take, commentDto.Skip);
        }

        [HttpPost("like")]
        public async Task<IActionResult> LikePost(LikeCommentDto likedCommentDto)
        {
            var user = this.GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not signed in!");
            }

            int? likes;
            try
            {
                likes = await this.commentService.LikeCommentAsync(likedCommentDto.CommentId, user);
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
        public List<PersonListPopupViewModel> GetLikes(GetCommentLikesDto dto)
        {
            return this.commentService.GetPeopleLikes(dto.CommentId, dto.Take, dto.Skip);
        }
    }
}
