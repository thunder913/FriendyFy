using FriendyFy.Data;
using FriendyFy.Models;
using FriendyFy.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
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
            try
            {
                var added = await userRepository.SaveChangesAsync();
                Console.WriteLine(added);
            }
            catch (Exception ex)
            {

            }
            finally
            {
                Console.WriteLine("tet");
            }


            return user;
        }

        public ApplicationUser GetByEmail(string email)
        {
            return this.userRepository.All().FirstOrDefault(x => x.Email == email);
        }
    }
}
