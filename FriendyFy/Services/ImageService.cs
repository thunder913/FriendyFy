using FriendyFy.BlobStorage;
using FriendyFy.Common;
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
        private readonly IBlobService blobService;

        public ImageService(IRepository<Image> imageRepository,
            IBlobService blobService)
        {
            this.imageRepository = imageRepository;
            this.blobService = blobService;
        }

        public async Task<Image> AddImageAsync(ImageType imageType)
        {
            var image = new Image()
            {
                ImageType = imageType,
                CreatedOn = DateTime.UtcNow,
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
