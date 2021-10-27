using Microsoft.AspNetCore.Authentication.JwtBearer;
using System;

namespace FriendyFy.Common
{
    public class GlobalConstants
    {
        public const string Email = "friendyfy@abv.bg";
        public const string BlobPictures = "pictures";
        public const string BlobProfilePictures = "profilepictures";
        public const string BlobCoverPictures = "coverpictures";
        public const string Issuer = "FriendyFy";
        public const string Audience = "User";
        public const string AuthSchemes =
            "Identity.Application" + "," + JwtBearerDefaults.AuthenticationScheme;
    }
}
