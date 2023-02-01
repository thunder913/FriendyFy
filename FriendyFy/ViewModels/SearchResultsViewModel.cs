using System.Collections.Generic;

namespace FriendyFy.ViewModels;

public class SearchResultsViewModel
{
    public List<SearchResultViewModel> SearchResults { get; set; }
    public int PeopleCount { get; set; }
    public int EventsCount { get; set; }
    public bool HasMorePeople { get; set; }
    public bool HasMoreEvents { get; set; }
}