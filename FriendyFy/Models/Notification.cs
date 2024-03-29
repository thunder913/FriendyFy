﻿using System;
using FriendyFy.Models.Common;

namespace FriendyFy.Models;

public class Notification : BaseModel<string>, IAuditInfo
{
    public new string Id { get; set; } = Guid.NewGuid().ToString();
    public Event Event { get; set; }
    public string EventId { get; set; }
    public ApplicationUser Inviter { get; set; }
    public string InviterId { get; set; }
    public ApplicationUser Invitee { get; set; }
    public string InviteeId { get; set; }
    public bool IsSeen { get; set; }
    // This is actully not available
    public bool IsAvailable { get; set; }
    public new DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public bool AcceptedStatus { get; set; }
}