using FriendyFy.Data;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using ViewModels;
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
            var user = this.GetUserByToken();
            if (user == null)
            {
                return Unauthorized("You are not signed in!");
            }
            var interests = JsonConvert.DeserializeObject<List<InterestDto>>(dto.Interests);
            var privacySettingsParsed = Enum.TryParse(dto.PrivacyOptions, out PrivacySettings privacySettings);
            var reocurringTypeParsed = Enum.TryParse(dto.ReocurringFrequency, out ReocurringType reocurringType);
            var dateParsed = DateTime.TryParseExact(dto.Date, "dd/MM/yyyy HH:mm",
                CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out var date);

            if (dto.Name.Length < 2)
            {
                return BadRequest("The name ccanot be that short!");
            }
            else if (!dateParsed ||
                date <= DateTime.Now)
            {
                return BadRequest("The event date is invalid!");
            }
            else if (interests.Count == 0)
            {
                return BadRequest("You must choose some interests!");
            }
            else if (dto.Latitude == null || dto.Longitude == null)
            {
                return BadRequest("You must choose a location!");
            }
            else if (string.IsNullOrWhiteSpace(dto.Description))
            {
                return BadRequest("Add a description!");
            }
            else if (!privacySettingsParsed)
            {
                return BadRequest("The privacy must be either private or public!");
            }
            else if (dto.IsReocurring && !reocurringTypeParsed)
            {
                return BadRequest("You have entered an invalid reocurring type!");
            }
            else if (string.IsNullOrWhiteSpace(dto.Image))
            {
                return BadRequest("The profile image is empty!");
            }
            else if (interests.Count > 6)
            {
                return BadRequest("The interests cannot be more than 6!");
            }


            var allInterests = await this.interestService.AddNewInterestsAsync(interests);
            await this.eventService.CreateEventAsync(dto.Name, date, allInterests, privacySettings, (decimal) dto.Latitude,(decimal) dto.Longitude, dto.IsReocurring, reocurringType, dto.Description, dto.Image, user.Id);
            return Ok();
            //return Ok(await this.chatService.SeeMessagesAsync(dto.ChatId, user));
        }

        [HttpPost("getById")]
        public async Task<IActionResult> GetEventById(GetEventIdDto eventDto)
        {
            var user = this.GetUserByToken();
            var toReturn = await this.eventService.GetEventByIdAsync(eventDto.Id, user?.Id);
            return Ok(toReturn);
        }
        [HttpGet]
        public IActionResult GetEvents()
        {
            var user = this.GetUserByToken();
            var events = this.eventService.GetEvents(user.Id);
            return Ok(events);
        }

        [HttpPost("likeEvent")]
        public async Task<IActionResult> LikeEvent(LikePostDto likePostDto)
        {
            var user = this.GetUserByToken();

            if (user == null)
            {
                return Unauthorized("You are not signed in!");
            }

            int? likes;
            try
            {
                likes = await this.eventService.LikeEventAsync(likePostDto.PostId, user);
            }
            catch (Exception ex)
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

        [HttpPost("join")]
        public async Task<IActionResult> JoinEvent(JoinEventDto dto)
        {
            var user = this.GetUserByToken();
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            var joined = await this.eventService.JoinEventAsync(dto.EventId, user);
            if (!joined)
            {
                return BadRequest("There was an error joining the event!");
            }
            return Ok();
        }

        [HttpPost("share")]
        public async Task<IActionResult> ShareEvent(ShareEventDto dto)
        {
            var user = this.GetUserByToken();
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            var success = await this.eventService.CreateEventPostAsync(dto.EventId, user.Id);
            if (success)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost("getNavEvents")]
        public IActionResult GetNavigationEvents()
        {
            var user = this.GetUserByToken();
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }
            var toReturn = new LeftNavigationEventsViewModel();
            toReturn.AttendingEvents = this.eventService.GetAttendingEvents(user.UserName);
            toReturn.OrganizedEvents = this.eventService.GetOrganizedEvents(user.UserName);
            toReturn.SuggestedEvents = this.eventService.GetSuggestedEvents(user);

            return Ok(toReturn);
        }

        [HttpPost("addImage")]
        public async Task<IActionResult> AddImage(AddEventImageDto dto)
        {
            var user = this.GetUserByToken();
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            var result = await this.eventService.AddImageToEventAsync(dto.EventId, user.Id, dto.Image);
            if (string.IsNullOrWhiteSpace(result))
            {
                return BadRequest("Something went wrong, try again!");
            }
            
            return Ok(result);
        }

        [HttpPost("leaveEvent")]
        public async Task<IActionResult> LeaveEvent(LeaveEventDto dto)
        {
            var user = this.GetUserByToken();
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }

            var removed = await this.eventService.LeaveEventAsync(dto.EventId, user.Id);
            if (removed)
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}
