using FriendyFy.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FriendyFy.Services.Contracts
{
    public interface IPostService
    {
        Task<bool> CreatePostAsync(MakePostDto makePostDto, string userId);
        public List<PostDetailsDto> GetAllPosts();
    }
}
