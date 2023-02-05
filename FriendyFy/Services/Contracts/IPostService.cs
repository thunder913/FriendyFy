using System.Collections.Generic;
using System.Threading.Tasks;
using FriendyFy.Data.Requests;
using FriendyFy.Models;
using FriendyFy.ViewModels;

namespace FriendyFy.Services.Contracts;

public interface IPostService
{
    Task<bool> CreatePostAsync(CreatePostRequest makePostDto, string userId);
    List<PostDetailsViewModel> GetAllPosts(string userId);
    Task<int?> LikePostAsync(string postId, ApplicationUser user);
    List<PersonListPopupViewModel> GetPeopleLikes(string postId, int take, int skip);
    List<PersonListPopupViewModel> GetTaggedPeople(string postId, int take, int skip);
    Task<PostDetailsViewModel> GetPostByImageIdAsync(string imageId, string userId);
    Task<int> RepostAsync(string id, string text, string userId);
    List<PersonListPopupViewModel> GetPeopleReposts(string postId, int take, int skip);
    Task<bool> DeletePostAsync(string postId, string userId);
    Task<List<PostDetailsViewModel>> GetFeedPosts(ApplicationUser user, bool isProfile, string userName, int take, int skip, List<string> ids);
}