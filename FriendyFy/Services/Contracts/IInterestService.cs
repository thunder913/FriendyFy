using FriendyFy.Data;
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
        public Interest GetInterest(int id);
        Task<List<Interest>> AddNewInterestsAsync(List<InterestDto> interests);
    }
}
