using System.Collections.Generic;
using System.Threading.Tasks;
using FriendyFy.Data;
using FriendyFy.Models;

namespace FriendyFy.Services.Contracts
{
    public interface IInterestService
    {
        public ICollection<InterestDto> GetAllInterests();
        public Interest CheckInterestSimillarWord(InterestDto interest);
        public Task<Interest> AddInterestToDbAsync(InterestDto interest);
        public Task<Interest> GetInterestAsync(int id);
        Task<List<Interest>> AddNewInterestsAsync(List<InterestDto> interests);
    }
}
