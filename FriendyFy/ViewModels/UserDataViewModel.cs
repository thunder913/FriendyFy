using System.Collections.Generic;
using AutoMapper;
using FriendyFy.Data.Dtos;
using FriendyFy.Mapping;

namespace FriendyFy.ViewModels;

public class UserDataViewModel : IMapFrom<UserDataDto>, IHaveCustomMappings
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
    public void CreateMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<UserDataDto, UserDataViewModel>()
            .ForMember(x => x.ProfilePhoto, y => y.Ignore())
            .ForMember(x => x.CoverPhoto, y => y.Ignore());
    }
}