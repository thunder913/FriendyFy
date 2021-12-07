using System.Collections.Generic;

namespace ViewModels.ViewModels
{
    public class FeedViewModel
    {
        public List<PostDetailsViewModel> Posts { get; set; }
        public bool HasPosts { get; set; }
        public bool HasEvents { get; set; }
    }
}
