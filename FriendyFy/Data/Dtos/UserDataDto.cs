using FriendyFy.ViewModels;
using System.Collections.Generic;

namespace FriendyFy.Data.Dtos;

public class UserDataDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Birthday { get; set; }
    public string ProfilePhotoName { get; set; }
    public string CoverPhotoName { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public List<InterestViewModel> Interests { get; set; } = new();
    public string Quote { get; set; }
}