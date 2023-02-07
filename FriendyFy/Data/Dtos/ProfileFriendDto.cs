namespace FriendyFy.Data.Dtos;

public class ProfileFriendDto
{
    public string Username { get; set; }
    public string ProfileImageName { get; set; }
    public string FullName { get; set; }
    public int MutualFriends { get; set; }
    public bool IsFriend { get; set; }
    public bool HasRequested { get; set; }
    public bool HasReceived { get; set; }
    public bool IsLoggedUser { get; set; }
}