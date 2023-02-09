using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Threading.Tasks;
using FriendyFy.Common;
using FriendyFy.Data.Dtos;
using FriendyFy.Data.Requests;
using FriendyFy.DataValidation;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using FriendyFy.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace FriendyFy.Controllers;

[Route("event")]
[ApiController]
public class EventController : BaseController
{
    private readonly IInterestService interestService;
    private readonly IEventService eventService;

    public EventController(IInterestService interestService,
        IEventService eventService)
    {
        this.interestService = interestService;
        this.eventService = eventService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateEvent(CreateEventRequest dto)
    {
        var userId = GetUserIdByToken();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(GlobalConstants.NotSignedInMessage);
        }
            
        var interests = JsonConvert.DeserializeObject<List<InterestDto>>(dto.Interests);
        try
        {
            EventValidator.ValidateCreateEvent(dto, interests);
        }
        catch (ValidationException e)
        {
            return BadRequest(e.Message);
        }

        var allInterests = await interestService.AddNewInterestsAsync(interests);
        await eventService.CreateEventAsync(dto.Name, DateTime.ParseExact(dto.Date, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal), 
            allInterests, Enum.Parse<PrivacySettings>(dto.PrivacyOptions), (decimal) dto.Latitude!,(decimal) dto.Longitude!, dto.Description, dto.Image, userId);
        return Ok();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEventById(string id)
    {
        var userId = GetUserIdByToken();
        
        return Ok(await eventService.GetEventByIdAsync(id, userId));
    }
        
    [HttpPost("like")]
    public async Task<IActionResult> LikeEvent(PostIdRequest likePostDto)
    {
        var userId = GetUserIdByToken();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(GlobalConstants.NotSignedInMessage);
        }

        int? likes;
        try
        {
            likes = await eventService.LikeEventAsync(likePostDto.PostId, userId);
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

    [HttpPost("join")]
    public async Task<IActionResult> JoinEvent(EventIdRequest dto)
    {
        var user = await GetUserByToken();
            
        if (user == null)
        {
            return Unauthorized("You are not logged in!");
        }

        var joined = await eventService.JoinEventAsync(dto.EventId, user);
        if (!joined)
        {
            return BadRequest("There was an error joining the event!");
        }
        return Ok();
    }

    [HttpPost("share")]
    public async Task<IActionResult> ShareEvent(EventIdRequest dto)
    {
        var userId = GetUserIdByToken();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized("You are not logged in!");
        }

        var success = await eventService.CreateEventPostAsync(dto.EventId, userId);
        if (success)
        {
            return Ok();
        }
        return BadRequest();
    }

    [HttpGet("navigationEvents")]
    public async Task<IActionResult> GetNavigationEvents()
    {
        var user = await GetUserByToken();

        if (user == null)
        {
            return Unauthorized("You are not logged in!");
        }
            
        var toReturn = new LeftNavigationEventsViewModel();
        toReturn.AttendingEvents = await eventService.GetAttendingEvents(user.UserName);
        toReturn.OrganizedEvents = await eventService.GetOrganizedEventsAsync(user.UserName);
        toReturn.SuggestedEvents = await eventService.GetSuggestedEventsAsync(user.UserName);

        return Ok(toReturn);
    }

    [HttpPost("image")]
    public async Task<IActionResult> AddImage(AddEventImageRequest dto)
    {
        var userId = GetUserIdByToken();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized("You are not logged in!");
        }

        var result = await eventService.AddImageToEventAsync(dto.EventId, userId, dto.Image);
        if (string.IsNullOrWhiteSpace(result))
        {
            return BadRequest("Something went wrong, try again!");
        }
            
        return Ok(result);
    }

    [HttpPost("leave")]
    public async Task<IActionResult> LeaveEvent(EventIdRequest dto)
    {
        var userId = GetUserIdByToken();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized("You are not logged in!");
        }

        var removed = await eventService.LeaveEventAsync(dto.EventId, userId);
        if (removed)
        {
            return Ok();
        }
        return BadRequest();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteEvent(EventIdRequest dto)
    {
        var userId = GetUserIdByToken();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized("You are not logged in!");
        }

        var deleted = await eventService.DeleteEventAsync(dto.EventId, userId);
        if(deleted)
            return Ok(deleted);

        return BadRequest();
    }

    [HttpGet("random")]
    public async Task<IActionResult> GetRandomEvent()
    {
        return Ok(await eventService.GetRandomEventIdAsync());
    }

    [HttpGet("invited")]
    public async Task<IActionResult> GetEventInvitePeople([FromQuery] EventInvitePeopleRequest dto)
    {
        var user = await GetUserByToken();

        if (user == null)
        {
            return Unauthorized("You are not logged in!");
        }

        return Ok(await eventService.GetPeopleInviteDtoAsync(dto.EventId, dto.Take, dto.Skip, user));
    }
}