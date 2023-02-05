using System.Collections.Generic;
using System.Threading.Tasks;
using FriendyFy.Models;
using FriendyFy.ViewModels;
using ViewModels;

namespace FriendyFy.Services.Contracts;

public interface ICommentService
{
    Task<PostCommentViewModel> AddCommentAsync(ApplicationUser user, string comment, string postId, PostType postType);
    List<PostCommentViewModel> GetCommentsForPost(string userId, string postId, int take, int skip, PostType postType);
    Task<int?> LikeCommentAsync(string commentId, ApplicationUser user, PostType postType);
    Task<List<PersonListPopupViewModel>> GetPeopleLikesAsync(string commentId, int take, int skip);
    Task<bool> DeleteCommentAsync(string userId, string commentId, PostType postType);
}