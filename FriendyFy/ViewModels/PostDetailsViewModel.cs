﻿using System;
using System.Collections.Generic;
using AutoMapper;
using FriendyFy.Data.Dtos;
using FriendyFy.Mapping;

namespace FriendyFy.ViewModels;

public class PostDetailsViewModel : IMapFrom<PostDetailsDto>, IHaveCustomMappings
{
    public string PostId { get; set; }
    public string CreatorImage { get; set; }
    public string CreatorName { get; set; }
    public int CreatedAgo { get; set; }
    public string PostMessage { get; set; }
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
    public int RepostsCount { get; set; }
    public string PostImage { get; set; }
    public bool IsLikedByUser { get; set; }
    public string Username { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string LocationCity { get; set; }
    public int TaggedPeopleCount { get; set; }
    public string PostType { get; set; }
    public bool IsUserCreator { get; set; }
    public string EventImage { get; set; }
    // Event only properties
    public string EventTitle { get; set; }
    public List<InterestViewModel> EventInterests { get; set; } = new();
    public List<string> EventGoing { get; set; } = new();
    public bool EventIsReocurring { get; set; }
    public string EventReocurring { get; set; }
    public DateTime EventTime { get; set; }
    public string EventPostId { get; set; }

    //Repost functionality
    public bool IsRepost { get; set; }
    public PostDetailsViewModel Repost { get; set; }
    public void CreateMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<PostDetailsDto, PostDetailsViewModel>()
            .ForMember(x => x.CreatorImage, y => y.Ignore())
            .ForMember(x => x.PostImage, y => y.Ignore())
            .ForMember(x => x.EventImage, y => y.Ignore())
            .ForMember(x => x.Repost, y => y.Ignore());
    }
}