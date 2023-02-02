namespace FriendyFy.Data.Requests;

public class CommentLikesRequest : PaginatedRequest
{
    public string CommentId { get; set; }
}