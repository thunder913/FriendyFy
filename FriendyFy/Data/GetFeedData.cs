using System.Collections.Generic;

namespace FriendyFy.Data;

public class GetFeedData
{
    public List<string> EventIds { get; set; } = new List<string>();
    public List<string> PostIds { get; set; } = new List<string>();
    public bool isProfile { get; set; }
    public string Username { get; set; }
    public int Take { get; set; }
    public bool HasPosts { get; set; }
    public bool HasEvents { get; set; }
    public string FeedType { get; set; }
}