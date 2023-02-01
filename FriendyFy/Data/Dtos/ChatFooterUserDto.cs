namespace FriendyFy.Data.Dtos;

public class ChatFooterUserDto
{
    public string Picture { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
    public string ChatId { get; set; }
    public int NewMessages { get; set; }
    public string FullName { get; set; }
}