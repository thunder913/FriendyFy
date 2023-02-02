namespace FriendyFy.Data.Requests;

public class NotificationRequest : PaginatedRequest
{
    public string UserId { get; set; }
}