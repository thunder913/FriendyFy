using System.Collections.Generic;

namespace FriendyFy.ViewModels;

public class FeedViewModel
{
    public List<PostDetailsViewModel> Posts { get; set; }
    public bool HasPosts { get; set; }
    public bool HasEvents { get; set; }
}