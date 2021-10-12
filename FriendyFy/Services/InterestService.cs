using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Services
{
    public class InterestService : IInterestService
    {
        private readonly IDeletableEntityRepository<Interest> interestRepository;

        public InterestService(IDeletableEntityRepository<Interest> interestRepository)
        {
            this.interestRepository = interestRepository;
        }

        public async Task<Interest> AddInterestToDbAsync(InterestDto interest)
        {
            var interestToAdd = new Interest(){ Name = interest.Label};
            var interestInDb = this.interestRepository.AllAsNoTracking().Where(x => x.Name == interest.Label).FirstOrDefault();
            if (interestInDb == null)
            {
                await this.interestRepository.AddAsync(interestToAdd);
                await this.interestRepository.SaveChangesAsync();
                return interestToAdd;
            }

            return interestInDb;
        }

        public Interest CheckInterestSimillarWord(InterestDto interest)
        {
            throw new System.NotImplementedException();
        }

        public ICollection<InterestDto> GetAllInterests()
        {
            return this.interestRepository.All()
                .Select(x => new InterestDto() 
            {
                Id = x.Id,
                Label = x.Name
            }).ToList();
        }

        public Interest GetInterest(int id)
        {
            return this.interestRepository
                .AllAsNoTracking()
                .Where(x => x.Id == id)
                .FirstOrDefault();
        }
    }
}
