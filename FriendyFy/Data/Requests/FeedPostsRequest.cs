using System.Collections.Generic;

namespace FriendyFy.Data.Requests;

public class FeedPostsRequest
{
    public List<string> EventIds { get; set; } = new();
    public List<string> PostIds { get; set; } = new();
    public bool IsProfile { get; set; }
    public string Username { get; set; }
    public int Take { get; set; }
    public bool HasPosts { get; set; }
    public bool HasEvents { get; set; }
    public string FeedType { get; set; }
}