using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Data
{
    public class SearchDto
    {
        public string SearchWord { get; set; }
        public int Take { get; set; }
        public int UsersCount { get; set; }
        public int EventsCount { get; set; }
    }
}
