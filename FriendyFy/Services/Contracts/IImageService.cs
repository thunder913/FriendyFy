using System.Threading.Tasks;
using FriendyFy.Models;
using FriendyFy.Models.Enums;

namespace FriendyFy.Services.Contracts;

public interface IImageService
{
    public Task<Image> AddImageAsync(ImageType imageType);
}