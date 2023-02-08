using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using FriendyFy.Data.Requests;
using FriendyFy.DataValidation;
using FriendyFy.Services.Contracts;
using FriendyFy.ViewModels;
using Microsoft.AspNetCore.Mvc;
using ViewModels;

namespace FriendyFy.Controllers;

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

    [HttpPost]
    public async Task<IActionResult> MakePost(CreatePostRequest makePostDto)
    {
        var user = await GetUserByToken();

        if (user == null)
        {
            return Unauthorized("You are not signed in!");
        }

        try
        {
            PostValidator.ValidateMakePost(makePostDto);
        }
        catch (ValidationException ex)
        {
            return BadRequest(ex.Message);
        }
            
        return Json(new { success = await postService.CreatePostAsync(makePostDto, user.Id) });
    }

    [HttpGet]
    public async Task<IActionResult> GetPosts()
    {
        var user = await GetUserByToken();

        if (user == null)
        {
            return Unauthorized("You are not signed in!");
        }

        return Json(postService.GetAllPosts(user.Id));
    }

    [HttpPost("like")]
    public async Task<IActionResult> LikePost([FromBody] PostIdRequest dto)
    {
        var user = await GetUserByToken();

        if (user == null)
        {
            return Unauthorized("You are not signed in!");
        }

        int? likes;
        try
        {
            likes = await postService.LikePostAsync(dto.PostId, user);
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
    public async Task<IActionResult> GetLikes([FromQuery] PostLikesRequest dto)
    {
        var parsed = Enum.TryParse(dto.PostType, out PostType postType);
        if (!parsed)
        {
            return BadRequest();
        }
        if (postType == PostType.Post)
        {
            return Ok(await postService.GetPeopleLikesAsync(dto.PostId, dto.Take, dto.Skip));
        }

        return Ok(await eventService.GetPeopleLikesAsync(dto.PostId, dto.Take, dto.Skip));
    }

    [HttpGet("reposts")]
    public async Task<IActionResult> GetReposts([FromQuery] PostLikesRequest dto)
    {
        var parsed = Enum.TryParse(dto.PostType, out PostType postType);
        if (!parsed)
        {
            return BadRequest();
        }
        if (postType == PostType.Post)
        {
            return Ok(await postService.GetPeopleRepostsAsync(dto.PostId, dto.Take, dto.Skip));
        }

        return Ok(eventService.GetPostReposts(dto.PostId, dto.Take, dto.Skip));
    }

    [HttpGet("tagged")]
    public async Task<List<PersonListPopupViewModel>> GetTaggedPeople([FromQuery] PostLikesRequest dto)
    {
        return await postService.GetTaggedPeopleAsync(dto.PostId, dto.Take, dto.Skip);
    }

    [HttpGet("image/{id}")]
    public async Task<IActionResult> GetPostByImageId(string id)
    {
        var user = await GetUserByToken();

        var post = await postService.GetPostByImageIdAsync(id, user != null ? user.Id : null);
        if (post == null)
        {
            return BadRequest();
        }
        return Ok(post);
    }

    [HttpPost("repost")]
    public async Task<IActionResult> Repost(RepostRequest dto)
    {
        var parsed = Enum.TryParse(dto.Type, out PostType postType);
        if (!parsed)
        {
            return BadRequest("There was something wrong with the request!");
        }
            
        var user = await GetUserByToken();
        if (user == null)
        {
            return Unauthorized("You are not logged in!");
        }

        switch (postType)
        {
            case PostType.Event:
            {
                var result = await eventService.RepostEventAsync(dto.PostId, dto.Text, user.Id);
                if (result > 0)
                {
                    return Ok(new { reposts = result });
                }

                break;
            }
            case PostType.Post:
            {
                var result = await postService.RepostAsync(dto.PostId, dto.Text, user.Id);
                if (result > 0)
                {
                    return Ok(new { reposts = result });
                }

                break;
            }
        }
        return BadRequest();
    }

    [HttpDelete]
    public async Task<IActionResult> DeletePost(DeletePostRequest dto)
    {
        var parsed = Enum.TryParse(dto.PostType, out PostType postType);
        if (!parsed)
        {
            return BadRequest("There was something wrong with the request!");
        }

        var user = await GetUserByToken();
        if (user == null)
        {
            return Unauthorized("You are not logged in!");
        }

        bool deleted = postType switch
        {
            PostType.Post => await postService.DeletePostAsync(dto.PostId, user.Id),
            PostType.Event => await eventService.DeleteEventPostAsync(dto.PostId, user.Id),
            _ => false
        };

        if (deleted)
        {
            return Ok(true);
        }

        return BadRequest();
    }

    [HttpGet("feed")]
    public async Task<IActionResult> GetFeedPosts([FromQuery] FeedPostsRequest dto)
    {
        var user = await GetUserByToken();

        var data = new List<PostDetailsViewModel>();
        var events = new List<PostDetailsViewModel>();
        var posts = new List<PostDetailsViewModel>();
        var toTake = dto.Take / 2;
            
        if (dto.FeedType != "posts")
        {
            if (dto.HasEvents)
            {
                events = await eventService.GetFeedEventsAsync(user, dto.IsProfile, dto.Username, toTake, dto.EventIds.Count(), dto.EventIds);
            }
        }
        if (dto.FeedType != "events")
        {
            if (dto.HasPosts)
            {
                posts = await postService.GetFeedPosts(user, dto.IsProfile, dto.Username, toTake, dto.PostIds.Count(), dto.PostIds);
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
            
        if (!dto.IsProfile)
        {
            data = data.OrderBy(x => Guid.NewGuid()).ToList();
        }
        else
        {
            data = data.OrderBy(x => x.CreatedAgo).ToList();
        }
        return Ok(new FeedViewModel
        {
            Posts = data,
            HasEvents = hasEvents,
            HasPosts = hasPosts
        });
    }
}