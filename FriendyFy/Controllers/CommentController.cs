using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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
        var user = await GetUserByToken();
        if (user == null)
        {
            return Unauthorized("You are not signed in!");
        }

        Enum.TryParse(comment.PostType, out PostType postType);

        var commentAdded = await commentService.AddCommentAsync(user.Id, comment.Text, comment.PostId, postType);
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
        var user = await GetUserByToken();
            
        var parsed = Enum.TryParse(commentDto.PostType, out PostType postType);
        if (parsed)
        {
            return commentService.GetCommentsForPost(user?.Id, commentDto.PostId, commentDto.Take, commentDto.Skip, postType);
        }
            
        return null;
    }

    [HttpPost("like")]
    public async Task<IActionResult> LikePost(CommentRequest likedCommentDto)
    {
        var user = await GetUserByToken();

        if (user == null)
        {
            return Unauthorized("You are not signed in!");
        }

        int? likes;
        Enum.TryParse(likedCommentDto.PostType, out PostType postType);
        try
        {
            likes = await commentService.LikeCommentAsync(likedCommentDto.CommentId, user.Id, postType);
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
        var user = await GetUserByToken();
            
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