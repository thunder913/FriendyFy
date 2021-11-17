using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Data
{
    public class PostDetailsDto
    {
        public string CreatorImage { get; set; }
        public string CreatorName { get; set; }
        public int CreatedAgo { get; set; }
        public string PostMessage { get; set; }
        public int LikesCount { get; set; }
        public int CommentsCount { get; set; }
        public int RepostsCount { get; set; }
        public string PostImage { get; set; }
    }
}
