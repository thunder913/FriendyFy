using System;
using FriendyFy.Models.Common;

namespace FriendyFy.Models;

public class PostTagged : IAuditInfo
{
    public string UserId { get; set; }
    public ApplicationUser User { get; set; }
    public string PostId { get; set; }
    public Post Post { get; set; }
    public DateTime CreatedOn { get; set; } = DateTime.Now;
    public DateTime? ModifiedOn { get; set; }
}