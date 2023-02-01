using FriendyFy.Mapping;
using FriendyFy.Models;

namespace FriendyFy.Data;

public class RegisterUserDto : IMapTo<ApplicationUser>
{
    public string Email { get; set; }

    public string Password { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Gender { get; set; }

    public string Birthday { get; set; }
    public string Theme { get; set; }
}