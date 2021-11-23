using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Data
{
    public class PostDetailsDto
    {
        public string PostId { get; set; }
        public string CreatorImage { get; set; }
        public string CreatorName { get; set; }
        public int CreatedAgo { get; set; }
        public string PostMessage { get; set; }
        public int LikesCount { get; set; }
        public int CommentsCount { get; set; }
        public int RepostsCount { get; set; }
        public string PostImage { get; set; }
        public bool IsLikedByUser { get; set; }
        public string Username { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string LocationCity { get; set; }
        public int TaggedPeopleCount { get; set; }
    }
}
