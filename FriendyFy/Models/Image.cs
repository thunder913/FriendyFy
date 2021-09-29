using FriendyFy.Models.Common;
using System.ComponentModel.DataAnnotations;

namespace FriendyFy.Models
{
    public class Image : BaseModel<string>
    {
        [Required]
        public string Url { get; set; }
    }
}
