using System;
using System.ComponentModel.DataAnnotations;
using FriendyFy.Models.Common;
using FriendyFy.Models.Enums;

namespace FriendyFy.Models;

public class Image : BaseModel<string>
{
    public new string Id { get; set; } = Guid.NewGuid().ToString();
    [Required]
    public string ImageExtension { get; set; } = ".jpeg";
    [Required]
    public ImageType ImageType { get; set; }
}