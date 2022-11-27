using FriendyFy.Models.Enums;
using System;
using System.Collections.Generic;
using ViewModels.ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface ISearchService
    {
        SearchResultsViewModel GetSearchResults(string search, string userId, int take, int skipPeople, int skipEvents);
        SearchPageResultsViewModel PerformSearch(int take, int skipPeople, int skipEvents, string searchWord, List<int> interestIds, SearchType searchType,
                    bool showOnlyUserEvents, DateTime eventDate, bool hasEventDate, string userId);
    }
}
