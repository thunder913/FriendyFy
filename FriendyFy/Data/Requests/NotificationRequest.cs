namespace FriendyFy.Data.Requests;

public class NotificationRequest
{
    public int Take { get; set; }
    public int Skip { get; set; }
    public string UserId { get; set; }
}