namespace FriendyFy.Data.Requests;

public class AddCommentRequest
{
    public string Text { get; set; }
    public string PostId { get; set; }
    public string PostType { get; set; }
}