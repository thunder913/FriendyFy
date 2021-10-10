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

        public async Task<bool> AddInterestToDbAsync(InterestDto interest)
        {
            await this.interestRepository.AddAsync(new Interest()
            {
                Name = interest.Label,
            });

            return await this.interestRepository.SaveChangesAsync()>0;
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
    }
}
