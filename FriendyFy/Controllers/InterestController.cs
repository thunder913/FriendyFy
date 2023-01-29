using System.Collections.Generic;
using FriendyFy.Data;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet]
        public ICollection<InterestDto> GetAllInterests()
        {
            return interestService.GetAllInterests();
        }
    }
}
