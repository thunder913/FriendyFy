using FriendyFy.Data;
using FriendyFy.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface IPostService
    {
        Task<bool> CreatePostAsync(MakePostDto makePostDto, string userId);
        List<PostDetailsDto> GetAllPosts(string userId);
        Task<int?> LikePostAsync(string postId, ApplicationUser user);
        List<PersonListPopupViewModel> GetPeopleLikes(string postId, int take, int skip);
        List<PersonListPopupViewModel> GetTaggedPeople(string postId, int take, int skip);
    }
}
