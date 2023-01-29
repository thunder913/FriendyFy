using System;
using System.Reflection;
using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Azure.Storage.Blobs;
using FriendyFy.BlobStorage;
using FriendyFy.Data;
using FriendyFy.Helpers.Contracts;
using FriendyFy.Helpers;
using FriendyFy.Messaging;
using FriendyFy.Models;
using FriendyFy.Services;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Azure.Core.Extensions;
using Azure.Storage.Queues;
using FriendyFy.Hubs;
using FriendyFy.Mapping;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using ViewModels;

var builder = WebApplication.CreateBuilder(args);

string kvURL = builder.Configuration["KeyVaultConfig:KVUrl"];
string tenantId = builder.Configuration["KeyVaultConfig:TenantId"];
string clientId = builder.Configuration["KeyVaultConfig:ClientId"];
string clientSecret = builder.Configuration["KeyVaultConfig:ClientSecretId"];

var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
var client = new SecretClient(new Uri(kvURL), credential);
builder.Configuration.AddAzureKeyVault(client, new AzureKeyVaultConfigurationOptions());

// Add services to the container.

builder.Services.AddControllersWithViews();
builder.Services.AddCors();

if (builder.Environment.IsProduction())
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(
            builder.Configuration.GetConnectionString("ProductionConnection")));
}
else
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection")));
}


builder.Services.AddSingleton(x =>
    new BlobServiceClient(builder.Configuration.GetValue<string>("AzureBlobStorage:ConnectionString")));

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddIdentityServer()
    .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

builder.Services.AddAuthentication()
    .AddIdentityServerJwt();

builder.Services.AddSingleton<IBlobService, BlobService>();
builder.Services.AddSingleton<IUserIdProvider, UserIdProvider>();

// Date repos
builder.Services.AddScoped(typeof(IDeletableEntityRepository<>), typeof(EfDeletableEntityRepository<>));
builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));

builder.Services.AddTransient<IEmailSender>(serviceProvider => new SendGridEmailSender(builder.Configuration["SendGrid-ApiKey"]));
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IInterestService, InterestService>();
builder.Services.AddTransient<IJwtService, JwtService>();
builder.Services.AddTransient<IImageService, ImageService>();
builder.Services.AddTransient<IPostService, PostService>();
builder.Services.AddTransient<IFriendService, FriendService>();
builder.Services.AddTransient<IGeolocationService, GeolocationService>();
builder.Services.AddTransient<IChatService, ChatService>();
builder.Services.AddTransient<IMessageService, MessageService>();
builder.Services.AddTransient<ICommentService, CommentService>();
builder.Services.AddTransient<IEventService, EventService>();
builder.Services.AddTransient<ISearchService, SearchService>();
builder.Services.AddTransient<INotificationService, NotificationService>();


builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddSignalR();
// In production, the React files will be served from this directory
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/build";
});
builder.Services.AddAzureClients(x =>
{
    x.AddBlobServiceClient(builder.Configuration["AzureBlobStorage:ConnectionString:blob"], preferMsi: true);
    x.AddQueueServiceClient(builder.Configuration["AzureBlobStorage:ConnectionString:queue"], preferMsi: true);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
AutoMapperConfig.RegisterMappings(typeof(ErrorViewModel).GetTypeInfo().Assembly);
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSpaStaticFiles();

app.UseRouting();

app.UseCors(options => options
    .WithOrigins("http://localhost:3000")
    .AllowAnyHeader()
    .AllowAnyOrigin()
    .AllowAnyMethod());

app.UseAuthentication();
app.UseIdentityServer();
app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");
    endpoints.MapRazorPages();
    endpoints.MapHub<ChatHub>("/chat");
    endpoints.MapHub<NotificationHub>("/notification");
});
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";

    if (app.Environment.IsDevelopment())
    {
        spa.UseReactDevelopmentServer(npmScript: "start");
    }
});

app.Run();

internal static class StartupExtensions
{
    public static IAzureClientBuilder<BlobServiceClient, BlobClientOptions> AddBlobServiceClient(this AzureClientFactoryBuilder builder, string serviceUriOrConnectionString, bool preferMsi)
    {
        if (preferMsi && Uri.TryCreate(serviceUriOrConnectionString, UriKind.Absolute, out Uri serviceUri))
        {
            return builder.AddBlobServiceClient(serviceUri);
        }

        return builder.AddBlobServiceClient(serviceUriOrConnectionString);
    }
    public static IAzureClientBuilder<QueueServiceClient, QueueClientOptions> AddQueueServiceClient(this AzureClientFactoryBuilder builder, string serviceUriOrConnectionString, bool preferMsi)
    {
        if (preferMsi && Uri.TryCreate(serviceUriOrConnectionString, UriKind.Absolute, out Uri serviceUri))
        {
            return builder.AddQueueServiceClient(serviceUri);
        }

        return builder.AddQueueServiceClient(serviceUriOrConnectionString);
    }
}