using FriendyFy.Models;
using FriendyFy.Models.Enums;
using System.Threading.Tasks;

namespace FriendyFy.Services.Contracts
{
    public interface IImageService
    {
        public Task<Image> AddImageAsync(ImageType imageType);
    }
}
