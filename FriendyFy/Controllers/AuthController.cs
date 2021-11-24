using FriendyFy.BlobStorage;
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
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly IUserService userService;
        private readonly IJwtService jwtService;
        private readonly IEmailSender emailSender;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IInterestService interestService;
        private readonly IBlobService blobService;
        private readonly IImageService imageService;
        private readonly IFriendService friendService;

        public AuthController(
            IUserService userService,
            IJwtService jwtService,
            IEmailSender emailSender,
            UserManager<ApplicationUser> userManager,
            IInterestService interestService,
            IBlobService blobService,
            IImageService imageService,
            IFriendService friendService)
        {
            this.userService = userService;
            this.jwtService = jwtService;
            this.emailSender = emailSender;
            this.userManager = userManager;
            this.interestService = interestService;
            this.blobService = blobService;
            this.imageService = imageService;
            this.friendService = friendService;
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
                CreatedOn = DateTime.UtcNow,
            };

            await this.userManager.CreateAsync(user);
            await this.userManager.AddClaimAsync(user, new Claim(ClaimTypes.NameIdentifier, user.Id));
            
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
        // TODO add email confirm check
        public IActionResult Login(LoginUserDto loginUserDto)
        {
            var user = this.userService.GetByEmail(loginUserDto.Email);

            if (user == null ||
                !BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.PasswordHash))
            {
                return BadRequest("Invalid credentials!");
            }

            var jwt = this.jwtService.Generate(user.Id, user.Email);

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
        public async Task<IActionResult> GetUser()
        {
            var mapper = AutoMapperConfig.MapperInstance;
            try
            {
                var user = this.GetUserByToken();
                var viewModel = new UserViewModel()
                {
                    Id = user.Id,
                    FinishedFirstTimeLogin = user.FinishedFirstTimeLogin,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    CoverPhoto = await this.blobService.GetBlobUrlAsync(user.CoverImage?.Id + user.CoverImage?.ImageExtension, GlobalConstants.BlobPictures),
                    ProfilePhoto = await this.blobService.GetBlobUrlAsync(user.ProfileImage?.Id + user.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures)
                };

                return Ok(viewModel);
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

        //userId is actually username
        [HttpGet("profilePicture/{userId}")]
        public async Task<string> GetProfilePicture(string userId)
        {
            var user = this.userService.GetByUsername(userId);

            return await this.blobService.GetBlobUrlAsync(user.ProfileImage?.Id + user.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures);
        }

        [HttpGet("coverPicture/{userId}")]
        public async Task<string> GetCoverPicture(string userId)
        {
            var user = this.userService.GetByUsername(userId);

            return await this.blobService.GetBlobUrlAsync(user.CoverImage?.Id + user.CoverImage?.ImageExtension, GlobalConstants.BlobPictures);
        }

        [HttpGet("getUserInformation/{username}")]
        public async Task<UserInformationViewModel> GetUserInformation(string username)
        {
            var user = this.userService.GetByUsername(username);
            var coverPicture = await this.blobService.GetBlobUrlAsync(user.CoverImage?.Id + user.CoverImage?.ImageExtension, GlobalConstants.BlobPictures);
            var profilePicture = await this.blobService.GetBlobUrlAsync(user.ProfileImage?.Id + user.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures);

            var viewModel = new UserInformationViewModel()
            {
                CoverImage = coverPicture,
                ProfileImage = profilePicture,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Interests = user.Interests.Select(x => new InterestViewModel() { Id = x.Id, Label = x.Name }).ToList(),
                Quote = user.Quote,
            };

            return viewModel;
        }

        [HttpGet("getUserSideInformation/{username}")]
        public async Task<UserInformationViewModel> GetUserSideInformation(string username)
        {
            var user = this.userService.GetByUsername(username);
            var coverPicture = await this.blobService.GetBlobUrlAsync(user.CoverImage?.Id + user.CoverImage?.ImageExtension, GlobalConstants.BlobPictures);
            var profilePicture = await this.blobService.GetBlobUrlAsync(user.ProfileImage?.Id + user.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures);

            var viewModel = new UserInformationViewModel()
            {
                CoverImage = coverPicture,
                ProfileImage = profilePicture,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Interests = user.Interests.Select(x => new InterestViewModel() { Id = x.Id, Label = x.Name }).ToList(),
                Quote = user.Quote,
            };

            return viewModel;
        }

        [HttpPost("FinishFirstTimeSetup")]
        public async Task<IActionResult> FinishFirstTimeSetup([FromForm] FinishFirstTimeSetupDto dto, IFormFile formFile)
        {
            var user = GetUserByToken();
            var interests = JsonConvert.DeserializeObject<List<InterestDto>>(dto.Interests);
            
            if (user == null)
            {
                return Unauthorized("You are not logged in!");
            }else if (interests.Count < 3)
            {
                return BadRequest("You must choose at least 3 interests!");
            }
            else if (string.IsNullOrWhiteSpace(dto.Quote))
            {
                return BadRequest("You must enter a description/quote!");
            }else if(dto.Latitude == null || dto.Longitude == null)
            {
                return BadRequest("You must choose a location!");
            }

            var allInterests = await this.interestService.AddNewInterestsAsync(interests);
            var profileImage = await imageService.AddImageAsync(ImageType.ProfileImage);
            var coverImage = await imageService.AddImageAsync(ImageType.ProfileImage);

            await blobService.UploadBase64StringAsync(dto.ProfilePhoto, profileImage.Id+profileImage.ImageExtension, GlobalConstants.BlobPictures);
            await blobService.UploadBase64StringAsync(dto.CoverPhoto, coverImage.Id+coverImage.ImageExtension, GlobalConstants.BlobPictures);

            await this.userService.SetUserFirstTimeLoginAsync(user, profileImage, coverImage, dto.Quote, allInterests, dto.Longitude, dto.Latitude);

            return Ok("success");
        }
    }
}
