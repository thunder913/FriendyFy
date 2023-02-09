using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Threading.Tasks;
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
        var user = await GetUserByToken();
 
        if (user == null)
        {
            return Unauthorized("You are not signed in!");
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
            allInterests, Enum.Parse<PrivacySettings>(dto.PrivacyOptions), (decimal) dto.Latitude!,(decimal) dto.Longitude!, dto.Description, dto.Image, user.Id);
        return Ok();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEventById(string id)
    {
        var user = await GetUserByToken();
        var toReturn = await eventService.GetEventByIdAsync(id, user?.Id);
        return Ok(toReturn);
    }
        
    [HttpPost("like")]
    public async Task<IActionResult> LikeEvent(PostIdRequest likePostDto)
    {
        var user = await GetUserByToken();

        if (user == null)
        {
            return Unauthorized("You are not signed in!");
        }

        int? likes;
        try
        {
            likes = await eventService.LikeEventAsync(likePostDto.PostId, user.Id);
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
        var user = await GetUserByToken();
            
        if (user == null)
        {
            return Unauthorized("You are not logged in!");
        }

        var success = await eventService.CreateEventPostAsync(dto.EventId, user.Id);
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
        var user = await GetUserByToken();
            
        if (user == null)
        {
            return Unauthorized("You are not logged in!");
        }

        var result = await eventService.AddImageToEventAsync(dto.EventId, user.Id, dto.Image);
        if (string.IsNullOrWhiteSpace(result))
        {
            return BadRequest("Something went wrong, try again!");
        }
            
        return Ok(result);
    }

    [HttpPost("leave")]
    public async Task<IActionResult> LeaveEvent(EventIdRequest dto)
    {
        var user = await GetUserByToken();
            
        if (user == null)
        {
            return Unauthorized("You are not logged in!");
        }

        var removed = await eventService.LeaveEventAsync(dto.EventId, user.Id);
        if (removed)
        {
            return Ok();
        }
        return BadRequest();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteEvent(EventIdRequest dto)
    {
        var user = await GetUserByToken();
            
        if (user == null)
        {
            return Unauthorized("You are not logged in!");
        }

        var deleted = await eventService.DeleteEventAsync(dto.EventId, user.Id);
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