using System;
using System.ComponentModel.DataAnnotations;
using FriendyFy.Models.Common;

namespace FriendyFy.Models;

public class UserFriend : BaseModel<string>
{
    [Key]
    public new string Id { get; set; } = Guid.NewGuid().ToString();
    public ApplicationUser CurrentUser { get; set; }
    public string CurrentUserId { get; set; }
    public ApplicationUser Friend { get; set; }
    public string FriendId { get; set; }
    public string RequestSenderId { get; set; }
    public bool IsFriend { get; set; }
}