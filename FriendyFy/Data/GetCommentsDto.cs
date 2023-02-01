namespace FriendyFy.Data;

public class GetCommentsDto
{
    public string PostType { get; set; }
    public string PostId { get; set; }
    public int Take { get; set; }
    public int Skip { get; set; }
}