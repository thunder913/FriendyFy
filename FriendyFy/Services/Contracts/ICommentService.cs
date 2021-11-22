using FriendyFy.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface ICommentService
    {
        Task<PostCommentViewModel> AddCommentAsync(ApplicationUser user, string comment, string postId);
        Task<bool> RemoveCommentAsync(string commentId, string userId);
        List<PostCommentViewModel> GetCommentsForPost(string userId, string postId, int take, int skip);
        Task<int?> LikeCommentAsync(string commentId, ApplicationUser user);
        List<PersonListPopupViewModel> GetPeopleLikes(string commentId, int take, int skip);
    }
}
