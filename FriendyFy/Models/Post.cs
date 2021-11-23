using FriendyFy.Models.Common;
using FriendyFy.Models.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FriendyFy.Models
{
    public class Post : BaseDeletableModel<string>, IAuditInfo
    {
        public new string Id = Guid.NewGuid().ToString();
        public ApplicationUser Creator { get; set; }
        public string CreatorId { get; set; }
        public string Text { get; set; }
        public Image Image { get; set; }
        public ICollection<PostLike> Likes { get; set; } = new HashSet<PostLike>();
        public ICollection<PostComment> Comments { get; set; } = new HashSet<PostComment>();
        public ICollection<Post> Reposts { get; set; } = new HashSet<Post>();
        public ICollection<PostTagged> TaggedPeople { get; set; } = new HashSet<PostTagged>();
        [Column(TypeName = "decimal(11, 8)")]
        public decimal? Latitude { get; set; }
        [Column(TypeName = "decimal(11, 8)")]
        public decimal? Longitude { get; set; }
        public string LocationCity { get; set; }
        public PrivacySettings Privacy { get; set; }
    }
}
