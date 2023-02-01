namespace FriendyFy.Data.Requests;

public class UserImagesRequest
{
    public string Username { get; set; }
    public int Take { get; set; }
    public int Skip { get; set; }
}