using System;
using AutoMapper;
using FriendyFy.Data.Dtos;
using FriendyFy.Mapping;

namespace FriendyFy.ViewModels;

public class NotificationViewModel : IMapFrom<NotificationDto>, IHaveCustomMappings
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string Image { get; set; }
    public string EventName { get; set; }
    public string InviterUsername { get; set; }
    public DateTime? Date { get; set; }
    public string EventId { get; set; }
    public bool IsAvailable { get; set; }
    public void CreateMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<NotificationDto, NotificationViewModel>()
            .ForMember(x => x.Image, y => y.Ignore());
    }
}