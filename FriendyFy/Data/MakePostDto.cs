using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Data
{
    public class MakePostDto
    {
        public string PrivacySettings { get; set; }
        public string PostMessage { get; set; }
        public decimal? LocationLat { get; set; }
        public decimal? LocationLng { get; set; }
        public string Image { get; set; }
        public List<string> People { get; set; }
    }
}
