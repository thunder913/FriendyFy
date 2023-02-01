using Duende.IdentityServer.EntityFramework.Options;
using FriendyFy.Models;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace FriendyFy.Data;

public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
{
    public ApplicationDbContext(
        DbContextOptions options,
        IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
    {
    }

    public DbSet<Event> Events { get; set; }
    public DbSet<Interest> Interests { get; set; }
    public DbSet<Post> Posts { get; set; }

    public DbSet<UserFriend> UserFriends { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Event>()
            .HasMany(x => x.Users)
            .WithMany(x => x.Events);

        builder.Entity<Interest>()
            .HasMany(x => x.Users)
            .WithMany(x => x.Interests);

        builder.Entity<Post>()
            .HasOne(x => x.Creator)
            .WithMany(x => x.Posts);

        builder.Entity<ApplicationUser>()
            .HasMany(x => x.Friends)
            .WithOne(x => x.CurrentUser);

        builder.Entity<ApplicationUser>()
            .HasMany(x => x.RemoveSuggestionFriends)
            .WithOne(x => x.User);

        builder.Entity<Chat>()
            .HasMany(x => x.Users)
            .WithMany(x => x.Chats);

        builder.Entity<Chat>()
            .HasMany(x => x.Messages)
            .WithOne(x => x.Chat);
            
        builder.Entity<Message>()
            .HasMany(x => x.SeenBy)
            .WithMany(x => x.ReadMessages);

        builder.Entity<Message>()
            .HasOne(x => x.User)
            .WithMany(x => x.Messages);

        builder.Entity<PostLike>()
            .HasIndex(x => new { x.LikedById, x.PostId})
            .IsUnique();

        builder.Entity<ApplicationUser>()
            .HasMany(x => x.EventsOrganized)
            .WithOne(x => x.Organizer);

        builder.Entity<Event>()
            .HasMany(x => x.EventPosts)
            .WithOne(x => x.Event);

        builder.Entity<EventPost>()
            .HasMany(x => x.Likes)
            .WithOne(x => x.EventPost);

        builder.Entity<EventPost>()
            .HasMany(x => x.Comments)
            .WithOne(x => x.EventPost);

        builder.Entity<EventPost>()
            .HasMany(x => x.Reposts)
            .WithOne(x => x.Repost);

        builder.Entity<Post>()
            .HasMany(x => x.Reposts)
            .WithOne(x => x.Repost);

        builder.Entity<Notification>()
            .HasOne(x => x.Event)
            .WithMany(x => x.Notification);
    }
}