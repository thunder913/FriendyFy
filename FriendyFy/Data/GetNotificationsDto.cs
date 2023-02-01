namespace FriendyFy.Data;

public class GetNotificationsDto
{
    public int Take { get; set; }
    public int Skip { get; set; }
    public string UserId { get; set; }
}