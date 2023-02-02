namespace FriendyFy.Data.Requests;

public class EventInvitePeopleRequest : PaginatedRequest
{
    public string EventId { get; set; }
}