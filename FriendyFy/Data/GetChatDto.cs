namespace FriendyFy.Data
{
    public class GetChatDto
    {
        public string Username { get; set; }
        public string ChatId { get; set; }
        public int Take { get; set; }
        public int Skip { get; set; }
    }
}
