﻿using System.Collections.Generic;
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
    public ICollection<InterestDto> GetAllInterests()
    {
        return interestService.GetAllInterests();
    }
}