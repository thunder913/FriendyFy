using System;

namespace FriendyFy.Data.Dtos;

public class NotificationDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string ImageName { get; set; }
    public string EventName { get; set; }
    public string InviterUsername { get; set; }
    public DateTime? Date { get; set; }
    public string EventId { get; set; }
    public bool IsAvailable { get; set; }
}