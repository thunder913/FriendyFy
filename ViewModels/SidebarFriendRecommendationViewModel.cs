using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels
{
    public class SidebarFriendRecommendationViewModel
    {
        public string Name { get; set; }
        public int MutualFriends { get; set; }
        public int CommonInterests { get; set; }
        public string Username { get; set; }
    }
}
