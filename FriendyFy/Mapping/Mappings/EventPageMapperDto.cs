﻿using System;
using System.Collections.Generic;
using AutoMapper;
using FriendyFy.Mapping;
using FriendyFy.ViewModels;

namespace FriendyFy.Data;

public class EventPageMapperDto : IMapTo<EventPageViewModel>, IHaveCustomMappings
{
    public string Id { get; set; }
    public List<string> Photos { get; set; } = new();
    public string MainPhoto { get; set; }
    public List<string> UserImages { get; set; } = new();
    public decimal? Lat { get; set; }
    public decimal? Lng { get; set; }
    public string City { get; set; }
    public DateTime Time { get; set; }
    public string Title { get; set; }
    public string Privacy { get; set; }
    public bool IsReocurring { get; set; }
    public string ReocurringTime { get; set; }
    public List<InterestViewModel> Interests { get; set; } = new();
    public string Organizer { get; set; }
    public string OrganizerUsername { get; set; }
    public string OrganizerImageUrl { get; set; }
    public bool IsInEvent { get; set; }
    public string Description { get; set; }
    public DateTime CreatedOn { get; set; }
    public bool IsOrganizer { get; set; }


    public void CreateMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<EventPageMapperDto, EventPageViewModel>()
            .ForMember(x => x.Photos, y => y.Ignore())
            .ForMember(x => x.MainPhoto, y => y.Ignore())
            .ForMember(x => x.UserImages, y => y.Ignore());
    }
}