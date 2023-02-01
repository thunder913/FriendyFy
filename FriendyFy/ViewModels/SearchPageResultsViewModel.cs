using System.Collections.Generic;

namespace FriendyFy.ViewModels;

public class SearchPageResultsViewModel : SearchResultsViewModel
{
    public new List<SearchPageResultViewModel> SearchResults { get; set; }
}