namespace FriendyFy.ViewModels;

public class ProfileFriendViewModel
{
    public string Username { get; set; }
    public string ProfileImage { get; set; }
    public string FullName { get; set; }
    public int MutualFriends { get; set; }
    public bool IsFriend { get; set; }
    public bool HasRequested { get; set; }
    public bool HasReceived { get; set; }
    public bool IsLoggedUser { get; set; }
}