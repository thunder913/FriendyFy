using AutoMapper;
using FriendyFy.Data.Dtos;
using FriendyFy.Mapping;

namespace FriendyFy.ViewModels;

public class SidebarFriendRecommendationViewModel : IMapFrom<FriendRecommendationDto>, IHaveCustomMappings
{
    public string Name { get; set; }
    public int MutualFriends { get; set; }
    public int CommonInterests { get; set; }
    public string Username { get; set; }
    public string ProfilePhoto { get; set; }
    public void CreateMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<FriendRecommendationDto, SidebarFriendRecommendationViewModel>()
            .ForMember(x => x.ProfilePhoto, y => y.Ignore());
    }
}