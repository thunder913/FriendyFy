namespace FriendyFy.Data.Requests;

public class PostLikesRequest
{
    public string PostId { get; set; }
    public string PostType { get; set; }
    public int Take { get; set; }
    public int Skip { get; set; }
}