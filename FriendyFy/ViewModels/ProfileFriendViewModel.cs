using AutoMapper;
using FriendyFy.Data.Dtos;
using FriendyFy.Mapping;

namespace FriendyFy.ViewModels;

public class ProfileFriendViewModel : IMapFrom<ProfileFriendDto>, IHaveCustomMappings
{
    public string Username { get; set; }
    public string ProfileImage { get; set; }
    public string FullName { get; set; }
    public int MutualFriends { get; set; }
    public bool IsFriend { get; set; }
    public bool HasRequested { get; set; }
    public bool HasReceived { get; set; }
    public bool IsLoggedUser { get; set; }
    public void CreateMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<ProfileFriendDto, ProfileFriendViewModel>()
            .ForMember(x => x.ProfileImage, y => y.Ignore());
    }
}