using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Services
{
    public class ImageService : IImageService
    {
        private readonly IRepository<Image> imageRepository;

        public ImageService(IRepository<Image> imageRepository)
        {
            this.imageRepository = imageRepository;
        }

        public async Task<Image> AddImageAsync(ImageType imageType, string name)
        {
            var image = new Image()
            {
                ImageType = imageType,
                Name = name,
            };

            try
            {
                await imageRepository.AddAsync(image);
            }
            catch(Exception ex)
            {

            }
            await imageRepository.SaveChangesAsync();
            return image;
        }
    }
}
