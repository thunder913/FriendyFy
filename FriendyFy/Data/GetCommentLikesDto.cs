namespace FriendyFy.Data
{
    public class GetCommentLikesDto
    {
        public string CommentId { get; set; }
        public int Take { get; set; }
        public int Skip { get; set; }
    }
}
