namespace FriendyFy.Data.Requests;

public class UserImagesRequest : PaginatedRequest
{
    public string Username { get; set; }
}