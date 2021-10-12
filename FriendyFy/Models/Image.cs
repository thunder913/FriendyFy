using FriendyFy.Models.Common;
using FriendyFy.Models.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace FriendyFy.Models
{
    public class Image : BaseModel<string>
    {
        public new string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Name { get; set; }

        [Required]
        public ImageType ImageType { get; set; }
    }
}
