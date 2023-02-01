using System;
using FriendyFy.Models.Common;

namespace FriendyFy.Models;

public class PostLike : BaseModel<string>, IAuditInfo
{
    public new string Id { get; set; } = Guid.NewGuid().ToString();
    public ApplicationUser LikedBy { get; set; }
    public string LikedById { get; set; }
    public Post Post { get; set; }
    public string PostId { get; set; }
}