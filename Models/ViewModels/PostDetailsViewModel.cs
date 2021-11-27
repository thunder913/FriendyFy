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
    }
}
