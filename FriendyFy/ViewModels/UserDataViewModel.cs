using System.Collections.Generic;

namespace FriendyFy.ViewModels;

public class UserDataViewModel
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Birthday { get; set; }
    public string ProfilePhoto { get; set; }
    public string CoverPhoto { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public List<InterestViewModel> Interests { get; set; } = new();
    public string Quote { get; set; }
}