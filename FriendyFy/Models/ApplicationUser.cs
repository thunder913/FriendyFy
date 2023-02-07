using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using FriendyFy.Mapping;
using FriendyFy.Models.Common;
using FriendyFy.Models.Enums;
using FriendyFy.ViewModels;
using Microsoft.AspNetCore.Identity;

namespace FriendyFy.Models;

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
    public ICollection<PostTagged> PostsTagged { get; set; } = new HashSet<PostTagged>();
    public ICollection<Interest> Interests { get; set; } = new HashSet<Interest>();
    public ICollection<Event> Events { get; set; } = new HashSet<Event>();
    public ICollection<UserFriend> Friends { get; set; } = new HashSet<UserFriend>();
    public ICollection<Group> Groups { get; set; } = new HashSet<Group>();
    public ICollection<PostLike> Likes { get; set; } = new HashSet<PostLike>();
    public ICollection<Post> Reposts { get; set; } = new HashSet<Post>();
    public ICollection<PostComment> Comments { get; set; } = new HashSet<PostComment>();
    public Image ProfileImage { get; set; }
    public Image CoverImage { get; set; }
    public ICollection<Image> Photos { get; set; } = new HashSet<Image>();
    public ICollection<RemoveSuggestionFriend> RemoveSuggestionFriends { get; set; } = new HashSet<RemoveSuggestionFriend>();
    public ICollection<RemoveSuggestionFriend> BlockedUserSuggestions { get; set; } = new HashSet<RemoveSuggestionFriend>();
    public ICollection<Chat> Chats { get; set; } = new HashSet<Chat>();
    public ICollection<Message> ReadMessages { get; set; } = new HashSet<Message>();
    public ICollection<Message> Messages { get; set; } = new HashSet<Message>();
    public ICollection<Event> EventsOrganized { get; set; } = new HashSet<Event>();
    public DateTime BirthDate { get; set; }
    public Gender Gender { get; set; }
    public bool FinishedFirstTimeLogin { get; set; }
    [Column(TypeName = "decimal(11, 8)")]
    public decimal? Latitude { get; set; }
    [Column(TypeName = "decimal(11, 8)")]
    public decimal? Longitude { get; set; }
    public ThemePreference ThemePreference { get; set; }
}