using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FriendyFy.Common;
using FriendyFy.Data.Requests;
using FriendyFy.Services.Contracts;
using FriendyFy.ViewModels;
using Microsoft.AspNetCore.Mvc;
using ViewModels;

namespace FriendyFy.Controllers;

[Route("comment")]
[ApiController]
public class CommentController : BaseController
{
    private readonly ICommentService commentService;

    public CommentController(ICommentService commentService)
    {
        this.commentService = commentService;
    }

    [HttpPost]
    public async Task<IActionResult> AddComment(AddCommentRequest comment)
    {
        var userId = GetUserIdByToken();
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(GlobalConstants.NotSignedInMessage);
        }

        Enum.TryParse(comment.PostType, out PostType postType);

        var commentAdded = await commentService.AddCommentAsync(userId, comment.Text, comment.PostId, postType);
        if (commentAdded != null)
        {
            return Ok(commentAdded);
        }

        return BadRequest();
        ;
    }

    [HttpGet]
    public async Task<List<PostCommentViewModel>> GetPostComments([FromQuery] PostCommentsRequest commentDto)
    {
        var userId = GetUserIdByToken();
        var parsed = Enum.TryParse(commentDto.PostType, out PostType postType);
        
        if (parsed)
        {
            return commentService.GetCommentsForPost(userId, commentDto.PostId, commentDto.Take, commentDto.Skip, postType);
        }
            
        return null;
    }

    [HttpPost("like")]
    public async Task<IActionResult> LikePost(CommentRequest likedCommentDto)
    {
        var userId = GetUserIdByToken();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(GlobalConstants.NotSignedInMessage);
        }

        int? likes;
        Enum.TryParse(likedCommentDto.PostType, out PostType postType);
        try
        {
            likes = await commentService.LikeCommentAsync(likedCommentDto.CommentId, userId, postType);
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

    [HttpGet("likes")]
    public async Task<List<PersonListPopupViewModel>> GetLikes([FromQuery] CommentLikesRequest dto)
    {
        return await commentService.GetPeopleLikesAsync(dto.CommentId, dto.Take, dto.Skip);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteComment(CommentRequest dto)
    {
        var userId = GetUserIdByToken();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }
        var parsed = Enum.TryParse(dto.PostType, out PostType postType);
        if (!parsed)
        {
            return BadRequest();
        }

        if(await commentService.DeleteCommentAsync(userId, dto.CommentId, postType))
        {
            return Ok();
        }

        return BadRequest();
    }
}