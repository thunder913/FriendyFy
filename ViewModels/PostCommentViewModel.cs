namespace ViewModels
{
    public class PostCommentViewModel
    {
        public string CommentorPicture { get; set; }
        public string CommentorName { get; set; }
        public int LikesCount { get; set; }
        public string CommentText { get; set; }
        public bool IsLikedByUser { get; set; }
        public int CreatedAgo { get; set; }
        public string Id { get; set; }
    }
}
