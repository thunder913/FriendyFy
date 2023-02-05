using System;
using System.Collections.Generic;
using AutoMapper;
using FriendyFy.Data.Dtos;
using FriendyFy.Mapping;

namespace FriendyFy.ViewModels;

public class NavigationEventViewModel : IMapFrom<EventDto>, IHaveCustomMappings
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Location { get; set; }
    public DateTime Time { get; set; }
    public List<InterestViewModel> Interests { get; set; } = new();
    public List<string> GoingPhotos { get; set; } = new();
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public void CreateMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<EventDto, NavigationEventViewModel>()
            .ForMember(x => x.GoingPhotos, y => y.Ignore());
    }
}