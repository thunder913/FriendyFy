namespace FriendyFy.Data.Dtos;

public class FriendRecommendationDto
{
    public string Name { get; set; }
    public int MutualFriends { get; set; }
    public int CommonInterests { get; set; }
    public string Username { get; set; }
    public string ProfilePhotoName { get; set; }
}