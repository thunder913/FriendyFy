using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace FriendyFy.Data
{
    public class FinishFirstTimeSetupDto
    {
        public string ProfilePhoto { get; set; }
        public string CoverPhoto { get; set; }
        public string Quote { get; set; }
        public string Interests { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
