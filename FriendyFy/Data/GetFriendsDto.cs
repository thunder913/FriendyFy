namespace FriendyFy.Data
{
    public class GetFriendsDto
    {
        public string UserId { get; set; }

        public int Count { get; set; }
        public int Skip { get; set; }
        public string SearchQuery { get; set; } = null;
    }
}
