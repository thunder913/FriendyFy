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

namespace FriendyFy.Controllers
{
    [Route("search")]
    [ApiController]
    public class SearchController : BaseController
    {
        private readonly ISearchService searchService;

        public SearchController(ISearchService searchService)
        {
            this.searchService = searchService;
        }

        [HttpPost]
        public IActionResult GetSearchResults(SearchDto dto)
        {
            var user = this.GetUserByToken();
            string userId = null;
            if (user != null)
            {
                userId = user.Id;
            }
            return Ok(this.searchService.GetSearchResults(dto.SearchWord, userId, dto.Take, dto.UsersCount, dto.EventsCount));
        }

        [HttpPost("search")]
        public IActionResult PerformSeach(SearchPageDto dto)
        {
            var user = this.GetUserByToken();
            var interests = JsonConvert.DeserializeObject<List<InterestDto>>(dto.Interests);

            if (user == null && dto.ShowOnlyUserEvents)
            {
                return BadRequest("You mush be logged in to use your events!");
            }

            var parsed = Enum.TryParse(dto.Type, out SearchType type);
            if (!parsed)
            {
                return BadRequest();
            }
            var parsedDate = DateTime.TryParseExact(dto.EventDate, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date);

            var result = this.searchService.PerformSearch(dto.Take, dto.SkipPeople, dto.SkipEvents, dto.SearchWord, interests.Where(x => x.IsNew == false).Select(x => x.Id).ToList(), type, dto.ShowOnlyUserEvents, date, parsedDate, user.Id);

            return Ok(result);
        }
    }
}
