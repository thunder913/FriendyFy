using FriendyFy.Common;
using FriendyFy.Helpers.Contracts;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FriendyFy.Helpers
{
    public class JwtService : IJwtService
    {
        private string secureKey = "8ziG4C6kzcEd7f0YidnlUAQL3JBG7xpWYKidvM8i";
        public string Generate(string id, string email)
        {
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secureKey));
            var credentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, id),
                new Claim(JwtRegisteredClaimNames.UniqueName, email)
            };

            var token = new JwtSecurityToken(GlobalConstants.Issuer,
                GlobalConstants.Audience,
                claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);


            //var header = new JwtHeader(credentials);

            //var payload = new JwtPayload(id, null, null, null, DateTime.Today.AddDays(1));
            //var securityToken = new JwtSecurityToken(header, payload);

            //return new JwtSecurityTokenHandler().WriteToken(securityToken);
        }

        public JwtSecurityToken Verify(string jwt)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secureKey);

            tokenHandler.ValidateToken(jwt, new TokenValidationParameters 
            {
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey = true,
                ValidateIssuer = false,
                ValidateAudience = false
            }, out SecurityToken validatedToken);

            return (JwtSecurityToken)validatedToken;
        }
    }
}
