using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using FriendyFy.Data.Dtos;
using FriendyFy.Data.Requests;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using FriendyFy.ViewModels;
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

    [HttpGet]
    public IActionResult GetSearchResults([FromQuery] SearchResultRequest dto)
    {
        var user = GetUserByToken();

        if (string.IsNullOrWhiteSpace(dto.SearchWord))
        {
            return Json(new SearchResultsViewModel());
        }
        
        string userId = null;
        if (user != null)
        {
            userId = user.Id;
        }
        return Ok(searchService.GetSearchResults(dto.SearchWord, userId, dto.Take, dto.UsersCount, dto.EventsCount));
    }

    [HttpPost]
    public async Task<IActionResult> PerformSearch(SearchRequest dto)
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