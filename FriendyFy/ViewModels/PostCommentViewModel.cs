using System;
using AutoMapper;
using FriendyFy.Data.Dtos;
using FriendyFy.Mapping;

namespace FriendyFy.ViewModels;

public class PostCommentViewModel : IMapFrom<PostCommentDto>, IHaveCustomMappings
{
    public string CommentorPicture { get; set; }
    public string CommentorName { get; set; }
    public string CommentorUsername { get; set; }
    public int LikesCount { get; set; }
    public string CommentText { get; set; }
    public bool IsLikedByUser { get; set; }
    public int CreatedAgo { get; set; }
    public string Id { get; set; }
    public string PostType { get; set; }
    public void CreateMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<PostCommentDto, PostCommentViewModel>()
            .ForMember(x => x.CommentorPicture, y => y.Ignore())
            .ForMember(x => x.CommentorName, opt => opt.MapFrom(x => x.Name))
            .ForMember(x => x.CommentorUsername, opt => opt.MapFrom(x => x.UserName))
            .ForMember(x => x.CreatedAgo, opt => opt.MapFrom(x => (int)(DateTime.UtcNow - x.CreatedOn).TotalMinutes));
    }
}