using System.Collections.Generic;
using ViewModels.ViewModels;

namespace ViewModels
{
    public class SearchPageResultsViewModel : SearchResultsViewModel
    {
        public new List<SearchPageResultViewModel> SearchResults { get; set; }
    }
}
