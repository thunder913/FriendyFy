using System.IdentityModel.Tokens.Jwt;

namespace FriendyFy.Helpers.Contracts
{
    public interface IJwtService
    {
        string Generate(string id, string email);

        JwtSecurityToken Verify(string jwt);
    }
}
