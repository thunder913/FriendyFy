namespace FriendyFy.Data.Requests;

public class ChatRequest
{
    public string Username { get; set; }
    public string ChatId { get; set; }
    public int Take { get; set; }
    public int Skip { get; set; }
}