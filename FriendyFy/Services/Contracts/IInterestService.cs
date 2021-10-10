﻿using FriendyFy.Data;
using FriendyFy.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FriendyFy.Services.Contracts
{
    public interface IInterestService
    {
        public ICollection<InterestDto> GetAllInterests();
        public Interest CheckInterestSimillarWord(InterestDto interest);
        public Task<Interest> AddInterestToDbAsync(InterestDto interest);
    }
}