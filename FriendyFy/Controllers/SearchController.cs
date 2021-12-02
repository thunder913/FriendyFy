using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
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
    }
}
