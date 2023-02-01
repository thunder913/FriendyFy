using System.Collections.Generic;

namespace FriendyFy.ViewModels;

public class SearchPageResultViewModel : SearchResultViewModel
{
    public int MutualFriends { get; set; }
    public List<InterestViewModel> Interests { get; set; }
}