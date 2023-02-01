namespace FriendyFy.Data.Requests;

public class SearchResultRequest
{
    public string SearchWord { get; set; }
    public int Take { get; set; }
    public int UsersCount { get; set; }
    public int EventsCount { get; set; }
}