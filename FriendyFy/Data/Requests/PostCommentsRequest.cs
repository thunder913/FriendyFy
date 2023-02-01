namespace FriendyFy.Data.Requests;

public class PostCommentsRequest
{
    public string PostType { get; set; }
    public string PostId { get; set; }
    public int Take { get; set; }
    public int Skip { get; set; }
}