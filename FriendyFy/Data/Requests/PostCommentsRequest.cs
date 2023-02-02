namespace FriendyFy.Data.Requests;

public class PostCommentsRequest : PaginatedRequest
{
    public string PostType { get; set; }
    public string PostId { get; set; }
}