using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace FriendyFy.Controllers
{
    [Route("api/interest")]
    [ApiController]
    public class InterestController : Controller
    {
        private readonly IInterestService interestService;

        public InterestController(IInterestService interestService)
        {
            this.interestService = interestService;
        }

        [HttpGet()]
        public ICollection<InterestDto> GetAllInterests()
        {
            return this.interestService.GetAllInterests();
        }
    }
}
