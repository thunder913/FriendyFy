using FriendyFy.BlobStorage;
using FriendyFy.Common;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Controllers
{
    [ApiController]
    [Route("blobs")]
    public class BlobController : Controller
    {
        private readonly IBlobService blobService;

        public BlobController(IBlobService blobService)
        {
            this.blobService = blobService;
        }

        [HttpGet("{blobName}")]
        public async Task<IActionResult> GetBlob(string blobName)
        {
            var data = await this.blobService.GetBlobAsync(blobName, GlobalConstants.BlobPictures);
            return File(data.Content, data.ContentType);
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListBlobs()
        {
            return Ok(await this.blobService.ListBlobAsync(GlobalConstants.BlobPictures));
        }

        [HttpPost("uploadfile")]
        public async Task<IActionResult> UploadFile([FromBody] UploadFileRequest request)
        {
            await this.blobService.UploadFileBlobAsync(request.FilePath, request.FileName, GlobalConstants.BlobPictures);
            return Ok();
        }

        [HttpPost("uploadcontent")]
        public async Task<IActionResult> UploadContent([FromBody] UploadContentRequest request)
        {
            await this.blobService.UploadContentBlobAsync(request.Content, request.FileName, GlobalConstants.BlobPictures);
            return Ok();
        }

        [HttpDelete("{blobName}")]
        public async Task<IActionResult> DeleteFile(string blobName)
        {
            await this.blobService.DeleteBlobAsync(blobName, GlobalConstants.BlobPictures);
            return Ok();
        }
    }
}
