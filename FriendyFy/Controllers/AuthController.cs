using BCrypt.Net;
using DataAnnotationsExtensions;
using FriendyFy.Data;
using FriendyFy.Helpers.Contracts;
using FriendyFy.Mapping;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FriendyFy.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IUserService userService;
        private readonly IJwtService jwtService;

        public AuthController(
            IUserService userService,
            IJwtService jwtService)
        {
            this.userService = userService;
            this.jwtService = jwtService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDto userDto)
        {
            var mapper = AutoMapperConfig.MapperInstance;
            TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;

            if (!DateTime.TryParseExact(userDto.Birthday, "dd/MM/yyyy",
                    CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out var birthday) ||
                    birthday > DateTime.Now ||
                    birthday < new DateTime(1900, 1, 1))
            {
                return BadRequest("The birthday is invalid!");
            };

            if (!(new EmailAddressAttribute().IsValid(userDto.Email)))
            {
                return BadRequest("The email is invalid!");
            }
            Regex nameValidator = new Regex(@"[A-Za-z\u00C0-\u1FFF\u2800-\uFFFD ]+$");
            if (userDto.FirstName.Length > 50 || userDto.FirstName.Length < 2 || !nameValidator.IsMatch(userDto.FirstName))
            {
                return BadRequest("The first name is invalid!");
            }
            if (userDto.LastName.Length > 50 || userDto.LastName.Length < 2 || !nameValidator.IsMatch(userDto.LastName))
            {
                return BadRequest("The last name is invalid!");
            }
            if (!Enum.TryParse(typeof(Gender), textInfo.ToTitleCase(userDto.Gender), out var gender))
            {
                return BadRequest("You must select a gender!");
            }
            var passwordNumberRegex = new Regex(@"\d");
            var passwordUpperCaseRegex = new Regex(@"[A-Z]");
            if (!passwordNumberRegex.IsMatch(userDto.Password) ||
                !passwordUpperCaseRegex.IsMatch(userDto.Password) ||
                userDto.Password.Length < 8)
            {
                return BadRequest("The password is invalid!");
            }

            var existingUser = this.userService.GetByEmail(userDto.Email) != null;
            if (existingUser)
            {
                return BadRequest("There is already a user with this email!");
            }

            var user = new ApplicationUser()
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
                Gender = (Gender)Enum.Parse(typeof(Gender), textInfo.ToTitleCase(userDto.Gender)),
                BirthDate = DateTime.ParseExact(userDto.Birthday, "dd/MM/yyyy", CultureInfo.InvariantCulture),
            };
            await this.userService.CreateAsync(user);
            return Created("registered", user);

        }

        [HttpPost("login")]
        public IActionResult Login(LoginUserDto loginUserDto)
        {
            var user = this.userService.GetByEmail(loginUserDto.Email);

            if (user == null ||
                !BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.PasswordHash))
            {
                return BadRequest("Invalid credentials!");
            }

            var jwt = this.jwtService.Generate(user.Id);

            Response.Cookies.Append("jwt", jwt, new CookieOptions()
            {
                HttpOnly = true
            });

            return Ok(new
            {
                message = "success",
                email = user.Email
            });
        }

        [HttpGet("user")]
        public IActionResult GetUser()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];

                var token = this.jwtService.Verify(jwt);

                var userId = token.Issuer;

                var user = this.userService.GetById(userId);

                return Ok(user);
            }
            catch (Exception e)
            {
                return Unauthorized();
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");

            return Ok(new
            {
                message = "success"
            });
        }
    }
}
