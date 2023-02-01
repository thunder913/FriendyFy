namespace FriendyFy.Data.Requests;

public class EventInvitePeopleRequest
{
    public string EventId { get; set; }
    public int Take { get; set; }
    public int Skip { get; set; }
}