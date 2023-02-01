using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using FriendyFy.Data;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace FriendyFy.Controllers;

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
        var user = GetUserByToken();
            
        string userId = null;
        if (user != null)
        {
            userId = user.Id;
        }
        return Ok(searchService.GetSearchResults(dto.SearchWord, userId, dto.Take, dto.UsersCount, dto.EventsCount));
    }

    [HttpPost("search")]
    public async Task<IActionResult> PerformSeach(SearchPageDto dto)
    {
        var user = GetUserByToken();
        var interests = JsonConvert.DeserializeObject<List<InterestDto>>(dto.Interests);
            
        var parsed = Enum.TryParse(dto.Type, out SearchType type);
        if (!parsed)
        {
            return BadRequest();
        }
        var parsedDate = DateTime.TryParseExact(dto.EventDate, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date);

        var result = await searchService.PerformSearchAsync(dto.Take, dto.SkipPeople, dto.SkipEvents, dto.SearchWord, interests.Where(x => x.IsNew == false).Select(x => x.Id).ToList(), type, dto.ShowOnlyUserEvents, date, parsedDate, user?.Id);

        return Ok(result);
    }
}