using FriendyFy.Data;
using System.Threading.Tasks;

namespace FriendyFy.Services.Contracts
{
    public interface IPostService
    {
        Task<bool> CreatePostAsync(MakePostDto makePostDto, string userId);
    }
}
