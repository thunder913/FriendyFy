using System;
using System.Collections.Generic;
using FriendyFy.Models.Common;

namespace FriendyFy.Models;

public class Message : BaseDeletableModel<string>
{
    public new string Id { get; set; } = Guid.NewGuid().ToString();
    public virtual ApplicationUser User { get; set; }
    public string UserId { get; set; }
    public virtual Chat Chat { get; set; }
    public string ChatId { get; set; }
    public string Text { get; set; }
    public virtual ICollection<ApplicationUser> SeenBy { get; set; } = new HashSet<ApplicationUser>();
}