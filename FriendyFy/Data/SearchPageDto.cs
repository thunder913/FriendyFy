namespace FriendyFy.Data;

public class SearchPageDto
{
    public string SearchWord { get; set; }
    public string Type { get; set; }
    public string Interests { get; set; }
    public bool ShowOnlyUserEvents { get; set; }
    public string EventDate { get; set; }
    public int Take { get; set; }
    public int SkipPeople { get; set; }
    public int SkipEvents { get; set; }
}