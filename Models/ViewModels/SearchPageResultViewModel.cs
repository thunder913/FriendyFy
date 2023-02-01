using System.Collections.Generic;

namespace ViewModels.ViewModels;

public class SearchPageResultViewModel : SearchResultViewModel
{
    public int MutualFriends { get; set; }
    public List<InterestViewModel> Interests { get; set; }
}