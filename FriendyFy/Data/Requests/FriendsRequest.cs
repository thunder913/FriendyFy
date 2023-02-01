namespace FriendyFy.Data.Requests;

public class FriendsRequest
{
    public string UserId { get; set; }
    public int Count { get; set; }
    public int Skip { get; set; }
    public string SearchQuery { get; set; } = null;
}