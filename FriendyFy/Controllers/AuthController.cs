using BCrypt.Net;
using FriendyFy.Common;
using FriendyFy.Data;
using FriendyFy.Helpers.Contracts;
using FriendyFy.Mapping;
using FriendyFy.Messaging;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
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
        private readonly IEmailSender emailSender;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IInterestService interestService;

        public AuthController(
            IUserService userService,
            IJwtService jwtService,
            IEmailSender emailSender,
            UserManager<ApplicationUser> userManager,
            IInterestService interestService)
        {
            this.userService = userService;
            this.jwtService = jwtService;
            this.emailSender = emailSender;
            this.userManager = userManager;
            this.interestService = interestService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDto userDto)
        {
            Regex nameValidator = new Regex(@"^[A-Za-z\u00C0-\u1FFF\u2800-\uFFFD 0-9-]+$");
            TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
            if (userDto.FirstName.Length > 50 || userDto.FirstName.Length < 2 || !nameValidator.IsMatch(userDto.FirstName))
            {
                return BadRequest("The first name is invalid!");
            }
            if (userDto.LastName.Length > 50 || userDto.LastName.Length < 2 || !nameValidator.IsMatch(userDto.LastName))
            {
                return BadRequest("The last name is invalid!");
            }
            if (!(new EmailAddressAttribute().IsValid(userDto.Email)))
            {
                return BadRequest("The email is invalid!");
            }
            if (!DateTime.TryParseExact(userDto.Birthday, "dd/MM/yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out var birthday) ||
                birthday > DateTime.Now ||
                birthday < new DateTime(1900, 1, 1))
            {
                return BadRequest("The birthday is invalid!");
            };
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
                UserName = this.userService.GenerateUsername(userDto.FirstName, userDto.LastName),
            };


            await this.userService.CreateAsync(user);

            var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            var callbackUrl = Url.Page(
            "/Auth/ConfirmEmail",
            pageHandler: null,
            values: new { userId = user.Id, code = code },
            protocol: Request.Scheme);

            await emailSender.SendEmailAsync(GlobalConstants.Email, "FriendyFy", user.Email, "Confirm your email",
            $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

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
            catch (Exception)
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

        [HttpPost("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailDto confirmDto)
        {
            if (confirmDto.UserId == null || confirmDto.Code == null)
            {
                return BadRequest("Invalid userId or code!");
            }

            var user = await userManager.FindByIdAsync(confirmDto.UserId);
            if (user.EmailConfirmed)
            {
                return BadRequest("The email is already activated!");
            }
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{confirmDto.UserId}'.");
            }

            var code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(confirmDto.Code));
            var result = await userManager.ConfirmEmailAsync(user, code);
            return result.Succeeded ? Ok() : BadRequest("Could not confirm the email!");
        }

        [HttpPost("FinishFirstTimeSetup")]
        public async Task<IActionResult> FinishFirstTimeSetup([FromForm] FinishFirstTimeSetupDto dto, IFormFile formFile)
        {
            var existingInterests = dto.Interests.Where(x => !x.IsNew).ToList();
            var newInterests = dto.Interests.Where(x => x.IsNew);
            var interests = new List<Interest>();
            //foreach (var interest in newInterests)
            //{
            //    // Check if there is something simillar in the DB and if not add it
            //}
            foreach (var item in newInterests)
            {
                interests.Add(await this.interestService.AddInterestToDbAsync(item));
            }

            var asd = "a";
            return new JsonResult("");
        }
    }
}
