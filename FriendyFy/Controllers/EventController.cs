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


            var allInterests = await this.interestService.AddNewInterestsAsync(interests);
            await this.eventService.CreateEventAsync(dto.Name, date, allInterests, privacySettings, (decimal) dto.Latitude,(decimal) dto.Longitude, dto.IsReocurring, reocurringType, dto.Description, user.Id);
            return Ok();
            //return Ok(await this.chatService.SeeMessagesAsync(dto.ChatId, user));
        }

        [HttpGet("{eventId}")]
        public async Task<IActionResult> GetEventById(string eventId)
        {
            var user = this.GetUserByToken();
            var toReturn = await this.eventService.GetEventByIdAsync(eventId, user?.Id);
            return Ok(toReturn);
        }
    }
}
