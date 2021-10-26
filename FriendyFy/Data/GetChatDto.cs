using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Data
{
    public class GetChatDto
    {
        public string Username { get; set; }
        public string ChatId { get; set; }
        public int Take { get; set; }
        public int Skip { get; set; }
    }
}
