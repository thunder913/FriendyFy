using FriendyFy.Data;
using FriendyFy.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using ViewModels;
using ViewModels.ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface IPostService
    {
        Task<bool> CreatePostAsync(MakePostDto makePostDto, string userId);
        List<PostDetailsViewModel> GetAllPosts(string userId);
        Task<int?> LikePostAsync(string postId, ApplicationUser user);
        List<PersonListPopupViewModel> GetPeopleLikes(string postId, int take, int skip);
        List<PersonListPopupViewModel> GetTaggedPeople(string postId, int take, int skip);
        PostDetailsViewModel GetPostByImageId(string imageId, string userId);
        Task<bool> RepostAsync(string id, string text, string userId);
        List<PersonListPopupViewModel> GetPeopleReposts(string postId, int take, int skip);
    }
}
