using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FriendyFy.Models.Enums;
using FriendyFy.ViewModels;

namespace FriendyFy.Services.Contracts;

public interface ISearchService
{
    Task<SearchResultsViewModel> GetSearchResultsAsync(string search, string userId, int take, int skipPeople,
        int skipEvents);
    Task<SearchPageResultsViewModel> PerformSearchAsync(int take, int skipPeople, int skipEvents, string searchWord,
        List<int> interestIds, SearchType searchType,
        bool showOnlyUserEvents, DateTime eventDate, bool hasEventDate, string userId);
}