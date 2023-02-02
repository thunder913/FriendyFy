using System;
using AutoMapper;
using FriendyFy.Mapping;
using FriendyFy.Models;

namespace FriendyFy.ViewModels;

public class ChatMessageViewModel : IMapFrom<Message>, IHaveCustomMappings
{
    public string MessageId { get; set; }
    public DateTime Date { get; set; }
    public bool IsYourMessage { get; set; }
    public string Message { get; set; }
    public string Name{ get; set; }
    public string Photo { get; set; }
    public string Username { get; set; }
    public void CreateMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<Message, ChatMessageViewModel>()
            .ForMember(x => x.MessageId, y => y.MapFrom(x => x.Id))
            .ForMember(x => x.Date, y => y.MapFrom(x => x.CreatedOn))
            .ForMember(x => x.Message, y => y.MapFrom(x => x.Text))
            .ForMember(x => x.Message, y => y.MapFrom(x => x.Text));
    }
}