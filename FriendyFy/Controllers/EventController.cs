using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using FriendyFy.Data;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ViewModels.ViewModels;

namespace FriendyFy.Controllers
{
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

        [HttpPost("create")]
        public async Task<IActionResult> CreateEvent(CreateEventDto dto)
        {
            var user = GetUserByToken();
            if (user == null)
            {
                return Unauthorized("You are not signed in!");
            }
            
            var interests = JsonConvert.DeserializeObject<List<InterestDto>>(dto.Interests);
            var privacySettingsParsed = Enum.TryParse(dto.PrivacyOptions, out PrivacySettings privacySettings);
            var dateParsed = DateTime.TryParseExact(dto.Date, "dd/MM/yyyy HH:mm",
                CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out var date);

            if (dto.Name.Length < 2)
            {
                return BadRequest("The name ccanot be that short!");
            }

            if (!dateParsed ||
                date <= DateTime.Now)
            {
                return BadRequest("The event date is invalid!");
            }

            if (interests.Count == 0)
            {
                return BadRequest("You must choose some interests!");
            }

            if (dto.Latitude == null || dto.Longitude == null)
            {
                return BadRequest("You must choose a location!");
            }

            if (string.IsNullOrWhiteSpace(dto.Description))
            {
                return BadRequest("Add a description!");
            }

            if (!privacySettingsParsed)
            {
                return BadRequest("The privacy must be either private or public!");
            }
            //else if (dto.IsReocurring && !reocurringTypeParsed)
            //{
            //    return BadRequest("You have entered an invalid reocurring type!");
            //}

            if (string.IsNullOrWhiteSpace(dto.Image))
            {
                return BadRequest("The profile image is empty!");
            }

            if (interests.Count > 6)
            {
                return BadRequest("The interests cannot be more than 6!");
            }


            var allInterests = await interestService.AddNewInterestsAsync(interests);
            await eventService.CreateEventAsync(dto.Name, date, allInterests, privacySettings, (decimal) dto.Latitude,(decimal) dto.Longitude, dto.Description, dto.Image, user.Id);
            return Ok();
            //return Ok(await this.chatService.SeeMessagesAsync(dto.ChatId, user));
        }

        [HttpPost("getById")]
        public async Task<IActionResult> GetEventById(GetEventIdDto eventDto)
        {
            var user = GetUserByToken();
            var toReturn = await eventService.GetEventByIdAsync(eventDto.Id, user?.Id);
            return Ok(toReturn);
        }
        
        [HttpPost("likeEvent")]
        public async Task<IActionResult> LikeEvent(LikePostDto likePostDto)
        {
            var user = GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not signed in!");
            }

            int? likes;
            try
            {
                likes = await eventService.LikeEventAsync(likePostDto.PostId, user);
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
        public async Task<IActionResult> JoinEvent(JoinEventDto dto)
        {
            var user = GetUserByToken();
            
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
        public async Task<IActionResult> ShareEvent(ShareEventDto dto)
        {
            var user = GetUserByToken();
            
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

        [HttpPost("getNavEvents")]
        public IActionResult GetNavigationEvents()
        {
            var user = GetUserByToken();
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }
            var toReturn = new LeftNavigationEventsViewModel();
            toReturn.AttendingEvents = eventService.GetAttendingEvents(user.UserName);
            toReturn.OrganizedEvents = eventService.GetOrganizedEvents(user.UserName);
            toReturn.SuggestedEvents = eventService.GetSuggestedEvents(user);

            return Ok(toReturn);
        }

        [HttpPost("addImage")]
        public async Task<IActionResult> AddImage(AddEventImageDto dto)
        {
            var user = GetUserByToken();
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

        [HttpPost("leaveEvent")]
        public async Task<IActionResult> LeaveEvent(LeaveEventDto dto)
        {
            var user = GetUserByToken();
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

        [HttpPost("deleteEvent")]
        public async Task<IActionResult> DeleteEvent(LeaveEventDto dto)
        {
            var user = GetUserByToken();
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            var deleted = await eventService.DeleteEventAsync(dto.EventId, user.Id);
            if(deleted)
                return Ok(deleted);

            return BadRequest();
        }

        [HttpPost("getRandomEvent")]
        public async Task<IActionResult> GetRandomEvent()
        {
            return Ok(await eventService.GetRandomEventIdAsync());
        }

        [HttpPost("getEventInvitePeople")]
        public async Task<IActionResult> GetEventInvitePeople(EventInvitePeopleDto dto)
        {
            var user = GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            return Ok(await eventService.GetPeopleInviteDtoAsync(dto.EventId, dto.Take, dto.Skip, user));
        }
    }
}
