using System;
using System.Collections.Generic;

namespace ViewModels.ViewModels
{
    public class PostDetailsViewModel
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
        public string PostType { get; set; }
        
        // Event only properties
        public string EventTitle { get; set; }
        public List<InterestViewModel> EventInterests { get; set; } = new List<InterestViewModel>();
        public List<string> EventGoing { get; set; } = new List<string>();
        public bool EventIsReocurring { get; set; }
        public string EventReocurring { get; set; }
        public DateTime EventTime { get; set; }
    }
}
