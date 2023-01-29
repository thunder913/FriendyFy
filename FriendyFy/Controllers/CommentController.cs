using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
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
            var user = GetUserByToken();
            if (user == null)
            {
                return Unauthorized("You are not signed in!");
            }

            Enum.TryParse(comment.PostType, out PostType postType);

            var commentAdded = await commentService.AddCommentAsync(user, comment.Text, comment.PostId, postType);
            if (commentAdded != null)
            {
                return Ok(commentAdded);
            }

            return BadRequest();
            ;
        }

        [HttpPost]
        public List<PostCommentViewModel> GetPostComments([FromBody] GetCommentsDto commentDto)
        {
            var user = GetUserByToken();
            
            var parsed = Enum.TryParse(commentDto.PostType, out PostType postType);
            if (parsed)
            {
                return commentService.GetCommentsForPost(user?.Id, commentDto.PostId, commentDto.Take, commentDto.Skip, postType);
            }
            
            return null;
        }

        [HttpPost("like")]
        public async Task<IActionResult> LikePost(LikeCommentDto likedCommentDto)
        {
            var user = GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not signed in!");
            }

            int? likes;
            Enum.TryParse(likedCommentDto.PostType, out PostType postType);
            try
            {
                likes = await commentService.LikeCommentAsync(likedCommentDto.CommentId, user, postType);
            }
            catch (Exception)
            {
                return BadRequest("There was an error saving your like!");
            }

            if (likes != null)
            {
                return Ok(likes);
            }

            return BadRequest();
        }

        [HttpPost("getLikes")]
        public List<PersonListPopupViewModel> GetLikes(GetCommentLikesDto dto)
        {
            return commentService.GetPeopleLikes(dto.CommentId, dto.Take, dto.Skip);
        }

        [HttpPost("deleteComment")]
        public async Task<IActionResult> DeleteComment(LikeCommentDto dto)
        {
            var user = GetUserByToken();
            
            if (user == null)
            {
                return Unauthorized();
            }
            var parsed = Enum.TryParse(dto.PostType, out PostType postType);
            if (!parsed)
            {
                return BadRequest();
            }

            if(await commentService.DeleteCommentAsync(user.Id, dto.CommentId, postType))
            {
                return Ok();
            }

            return BadRequest();
        }
    }
}
