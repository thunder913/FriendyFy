namespace FriendyFy.Data.Requests;

public class PostLikesRequest : PaginatedRequest
{
    public string PostId { get; set; }
    public string PostType { get; set; }
}