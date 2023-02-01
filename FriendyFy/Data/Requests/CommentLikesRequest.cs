namespace FriendyFy.Data.Requests;

public class CommentLikesRequest
{
    public string CommentId { get; set; }
    public int Take { get; set; }
    public int Skip { get; set; }
}