using System.ComponentModel;
using AutoMapper;
using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Data.Dtos;
using FriendyFy.Mapping;
using Microsoft.Extensions.DependencyInjection;

namespace FriendyFy.ViewModels;

public class PersonListPopupViewModel : IMapFrom<PersonLikeDto>, IHaveCustomMappings
{
    public string ProfileImage { get; set; }
    public string Name { get; set; }
    public string Username { get; set; }
    public bool IsInvited { get; set; }
    public void CreateMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<PersonLikeDto, PersonListPopupViewModel>()
            .ForMember(x => x.ProfileImage, y => y.Ignore())
            .ForMember(x => x.Name, y => y.MapFrom(z => z.FirstName + " " + z.LastName))
            .ForMember(x => x.Username, y => y.MapFrom(z => z.UserName))
            .ForMember(x => x.IsInvited, y => y.Ignore());
    }
}