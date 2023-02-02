namespace FriendyFy.Data.Requests;

public class ChatRequest : PaginatedRequest
{
    public string Username { get; set; }
    public string ChatId { get; set; }
}