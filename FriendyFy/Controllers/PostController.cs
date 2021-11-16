using FriendyFy.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Controllers
{
    [Route("friend")]
    [ApiController]
    public class PostController : BaseController
    {
        [HttpPost("make")]
        public IActionResult MakePost(MakePostDto makePostDto)
        {

            return Json("");
        }
    }
}
