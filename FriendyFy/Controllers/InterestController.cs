using System.Collections.Generic;
using System.Threading.Tasks;
using FriendyFy.Data.Dtos;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace FriendyFy.Controllers;

[Route("interest")]
[ApiController]
public class InterestController : Controller
{
    private readonly IInterestService interestService;

    public InterestController(IInterestService interestService)
    {
        this.interestService = interestService;
    }

    [HttpGet]
    public async Task<ICollection<InterestDto>> GetAllInterests()
    {
        return await interestService.GetAllInterestsAsync();
    }
}