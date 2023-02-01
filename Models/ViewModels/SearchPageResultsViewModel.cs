using System.Collections.Generic;

namespace ViewModels.ViewModels;

public class SearchPageResultsViewModel : SearchResultsViewModel
{
    public new List<SearchPageResultViewModel> SearchResults { get; set; }
}