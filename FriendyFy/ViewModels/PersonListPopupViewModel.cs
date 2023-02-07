using AutoMapper;
using FriendyFy.Data.Dtos;
using FriendyFy.Mapping;

namespace FriendyFy.ViewModels;

public class PersonListPopupViewModel : IMapFrom<PersonPopUpDto>, IHaveCustomMappings
{
    public string ProfileImage { get; set; }
    public string Name { get; set; }
    public string Username { get; set; }
    public bool IsInvited { get; set; }
    public void CreateMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<PersonPopUpDto, PersonListPopupViewModel>()
            .ForMember(x => x.ProfileImage, y => y.Ignore())
            .ForMember(x => x.Name, y => y.MapFrom(z => z.FirstName + " " + z.LastName))
            .ForMember(x => x.Username, y => y.MapFrom(z => z.UserName))
            .ForMember(x => x.IsInvited, y => y.Ignore());

        configuration.CreateMap<PersonRepostDto, PersonListPopupViewModel>()
            .ForMember(x => x.ProfileImage, y => y.Ignore())
            .ForMember(x => x.IsInvited, y => y.MapFrom(z => z.Name));
    }
}