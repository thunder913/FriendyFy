﻿using FriendyFy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Services.Contracts
{
    public interface IUserService
    {
        Task<ApplicationUser> CreateAsync(ApplicationUser user);

        ApplicationUser GetByEmail(string email);

        ApplicationUser GetById(string id);

        string GenerateUsername(string firstName, string lastName);

        ApplicationUser GetByUsername(string username);
        Task SetUserFirstTimeLoginAsync(ApplicationUser user, Image profileImage, Image coverImage, string quote, List<Interest> interests, decimal? longitude, decimal? latitude);
    }
}
