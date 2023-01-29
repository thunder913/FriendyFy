using System;
using System.Threading.Tasks;
using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;

namespace FriendyFy.Services
{
    public class ImageService : IImageService
    {
        private readonly IRepository<Image> imageRepository;

        public ImageService(IRepository<Image> imageRepository)
        {
            this.imageRepository = imageRepository;
        }

        public async Task<Image> AddImageAsync(ImageType imageType)
        {
            var image = new Image
            {
                ImageType = imageType,
                CreatedOn = DateTime.UtcNow,
            };

            try
            {
                imageRepository.Add(image);
            }
            catch (Exception)
            {
                // ignored
            }

            await imageRepository.SaveChangesAsync();
            return image;
        }
    }
}
