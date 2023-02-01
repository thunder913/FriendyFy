namespace FriendyFy.Data.Requests;

public class UserChatsRequest
{
    public string Username { get; set; }
    public int Page { get; set; }
    public int Take { get; set; }
    public string Search { get; set; }
    public int ItemsPerPage { get; set; }
    public string ChatIds { get; set; }
}