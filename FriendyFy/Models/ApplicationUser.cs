using FriendyFy.Mapping;
using FriendyFy.Models.Common;
using FriendyFy.Models.Enums;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using ViewModels;

namespace FriendyFy.Models
{
    public class ApplicationUser : IdentityUser, IAuditInfo, IDeletableEntity, IMapTo<UserViewModel>
    {
        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedOn { get; set; }
        public string Quote { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public ICollection<Post> Posts { get; set; } = new HashSet<Post>();
        public ICollection<Interest> Interests { get; set; } = new HashSet<Interest>();
        public ICollection<Event> Events { get; set; } = new HashSet<Event>();
        public ICollection<UserFriend> Friends { get; set; } = new HashSet<UserFriend>();
        public ICollection<Group> Groups { get; set; } = new HashSet<Group>();
        public ICollection<PostLike> Likes { get; set; } = new HashSet<PostLike>();
        public ICollection<PostRepost> Reposts { get; set; } = new HashSet<PostRepost>();
        public ICollection<PostComment> Comments { get; set; } = new HashSet<PostComment>();
        public ICollection<Image> Photos { get; set; } = new HashSet<Image>();
        public ICollection<RemoveSuggestionFriend> RemoveSuggestionFriends { get; set; } = new HashSet<RemoveSuggestionFriend>();
        public DateTime BirthDate { get; set; }
        public Gender Gender { get; set; }
        public bool FinishedFirstTimeLogin { get; set; }
        [Column(TypeName = "decimal(11, 8)")]
        public decimal? Latitude { get; set; }
        [Column(TypeName = "decimal(11, 8)")]
        public decimal? Longitude { get; set; }
    }
}
