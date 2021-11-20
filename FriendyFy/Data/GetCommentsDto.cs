namespace FriendyFy.Data
{
    public class GetCommentsDto
    {
        public string PostId { get; set; }
        public int Take { get; set; }
        public int Skip { get; set; }
    }
}
