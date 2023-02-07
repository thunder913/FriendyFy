using System;

namespace FriendyFy.Data.Dtos;

public class PostCommentDto
{
    public string UserName { get; set; }
    public string Name { get; set; }
    public string ProfilePicture { get; set; }
    public string CommentText { get; set; }
    public DateTime CreatedOn { get; set; }
    public bool IsLikedByUser { get; set; }
    public int LikesCount { get; set; }
    public string Id { get; set; }
    public string PostType { get; set; }
}