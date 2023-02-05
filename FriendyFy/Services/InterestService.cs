using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FriendyFy.Data;
using FriendyFy.Data.Dtos;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using Microsoft.EntityFrameworkCore;

namespace FriendyFy.Services;

public class InterestService : IInterestService
{
    private readonly IDeletableEntityRepository<Interest> interestRepository;

    public InterestService(IDeletableEntityRepository<Interest> interestRepository)
    {
        this.interestRepository = interestRepository;
    }

    public async Task<List<Interest>> AddNewInterestsAsync(List<InterestDto> interests)
    {
        var allInterests = new List<Interest>();
        foreach (var item in interests)
        {
            if (item.IsNew)
            {
                allInterests.Add(await AddInterestToDbAsync(item));
            }
            else
            {
                allInterests.Add(await GetInterestAsync(item.Id));
            }
        }

        return allInterests;
    }

    public async Task<Interest> AddInterestToDbAsync(InterestDto interest)
    {
        var interestToAdd = new Interest { Name = interest.Label};
        var interestInDb = await interestRepository.AllAsNoTracking().FirstOrDefaultAsync(x => x.Name == interest.Label);
        
        if (interestInDb != null) return interestInDb;
        
        interestRepository.Add(interestToAdd);
        await interestRepository.SaveChangesAsync();
        return interestToAdd;

    }

    public async Task<ICollection<InterestDto>> GetAllInterestsAsync()
    {
        return await interestRepository
            .All()
            .Select(x => new InterestDto
            {
                Id = x.Id,
                Label = x.Name
            }).ToListAsync();
    }

    public async Task<Interest> GetInterestAsync(int id)
    {
        return await interestRepository
            .All()
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}