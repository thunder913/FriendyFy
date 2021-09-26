using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FriendyFy.Services
{
    public class UserService : IUserService
    {
        private readonly IDeletableEntityRepository<ApplicationUser> userRepository;

        public UserService(IDeletableEntityRepository<ApplicationUser> userRepository)
        {
            this.userRepository = userRepository;
        }
        public async Task<ApplicationUser> CreateAsync(ApplicationUser user)
        {
            await userRepository.AddAsync(user);
            await userRepository.SaveChangesAsync();

            return user;
        }

        public string GenerateUsername(string firstName, string lastName)
        {
            var rand = new Random();
            var numbers = rand.Next(1, 10);

            var username = new StringBuilder();
            username.Append(firstName);
            username.Append(".");
            username.Append(lastName);
            username.Append(".");

            var number = 0;
            while (numbers > 0)
            {
                number += numbers * rand.Next(0, 10);
                numbers--;
            }

            bool freeName = false;
            while (freeName)
            {
                var currentName = username.ToString() + number;
                if (this.GetByUsername(currentName) == null)
                {
                    break;
                }
                number++;
            }
            username.Append(number);

            return username.ToString();
        }

        public ApplicationUser GetByEmail(string email)
        {
            return this.userRepository.All().FirstOrDefault(x => x.Email == email);
        }

        public ApplicationUser GetById(string id)
        {
            return this.userRepository.All().FirstOrDefault(x => x.Id == id);
        }

        public ApplicationUser GetByUsername(string username)
        {
            return this.userRepository.All().FirstOrDefault(x => x.UserName == username);
        }
    }
}
