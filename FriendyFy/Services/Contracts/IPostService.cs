using FriendyFy.Data;

namespace FriendyFy.Services.Contracts
{
    public interface IPostService
    {
        bool CreatePost(MakePostDto makePostDto);
    }
}
