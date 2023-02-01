using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using FriendyFy.BlobStorage;
using FriendyFy.Common;
using FriendyFy.Data.Dtos;
using FriendyFy.Data.Requests;
using FriendyFy.DataValidation;
using FriendyFy.Helpers.Contracts;
using FriendyFy.Messaging;
using FriendyFy.Models;
using FriendyFy.Models.Enums;
using FriendyFy.Services.Contracts;
using FriendyFy.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;

namespace FriendyFy.Controllers;

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

    public AuthController(
        IUserService userService,
        IJwtService jwtService,
        IEmailSender emailSender,
        UserManager<ApplicationUser> userManager,
        IInterestService interestService,
        IBlobService blobService,
        IImageService imageService)
    {
        this.userService = userService;
        this.jwtService = jwtService;
        this.emailSender = emailSender;
        this.userManager = userManager;
        this.interestService = interestService;
        this.blobService = blobService;
        this.imageService = imageService;
    }
    public IActionResult Index()
    {
        return View();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegistrationRequest userDto)
    {
        try
        {
            AuthValidator.ValidateRegisterUser(userDto);
        }
        catch (ValidationException ex)
        {
            return BadRequest(ex.Message);
        }

        TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
        var existingUser = userService.GetByEmail(userDto.Email) != null;

        if (existingUser)
        {
            return BadRequest("There is already a user with this email!");
        }

        var user = new ApplicationUser
        {
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            Email = userDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
            Gender = (Gender)Enum.Parse(typeof(Gender), textInfo.ToTitleCase(userDto.Gender)),
            BirthDate = DateTime.ParseExact(userDto.Birthday, "dd/MM/yyyy", CultureInfo.InvariantCulture),
            UserName = userService.GenerateUsername(userDto.FirstName, userDto.LastName),
            CreatedOn = DateTime.UtcNow,
            EmailConfirmed = false,
            ThemePreference = Enum.Parse<ThemePreference>(textInfo.ToTitleCase(userDto.Theme))
        };

        await userManager.CreateAsync(user);
        await userManager.AddClaimAsync(user, new Claim(ClaimTypes.NameIdentifier, user.Id));
            
        var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        var callbackUrl = Url.Page(
            "/Auth/ConfirmEmail",
            pageHandler: null,
            values: new { userId = user.Id, code },
            protocol: Request.Scheme);

        await emailSender.SendEmailAsync(GlobalConstants.Email, "FriendyFy", user.Email, "Confirm your email",
            $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

        return Created("registered", user);
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequest loginUserDto)
    {
        var user = userService.GetByEmail(loginUserDto.Email);

        try
        {
            AuthValidator.ValidateLoginUser(loginUserDto, user);
        }
        catch (ValidationException ex)
        {
            return BadRequest(ex.Message);
        }

        var jwt = jwtService.Generate(user.Id, user.Email);

        Response.Cookies.Append("jwt", jwt, new CookieOptions
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
        try
        {
            var user = GetUserByToken();

            if (user is null)
            {
                return Unauthorized();
            }

            var viewModel = new UserViewModel
            {
                Id = user.Id,
                FinishedFirstTimeLogin = user.FinishedFirstTimeLogin,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                CoverPhoto = await blobService.GetBlobUrlAsync(user.CoverImage?.Id + user.CoverImage?.ImageExtension, GlobalConstants.BlobPictures),
                ProfilePhoto = await blobService.GetBlobUrlAsync(user.ProfileImage?.Id + user.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures),
                IsDark = user.ThemePreference == ThemePreference.Dark,
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
    public async Task<IActionResult> ConfirmEmail(ConfirmEmailRequest confirmDto)
    {
        try
        {
            AuthValidator.ValidateConfirmEmail(confirmDto);
            var user = await userManager.FindByIdAsync(confirmDto.UserId);
            AuthValidator.ValidateUserEmailConfirmed(user);

            var code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(confirmDto.Code));
            var result = await userManager.ConfirmEmailAsync(user!, code);

            return result.Succeeded ? Ok() : BadRequest("Could not confirm the email!");
        }
        catch (ValidationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    //TODO remove this endpoint if you dont find a use for it
    [HttpGet("profilePicture/{username}")]
    public async Task<string> GetProfilePicture(string username)
    {
        var user = userService.GetByUsername(username);

        return await blobService.GetBlobUrlAsync(user.ProfileImage?.Id + user.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures);
    }

    [HttpGet("coverPicture/{userId}")]
    public async Task<string> GetCoverPicture(string userId)
    {
        var user = userService.GetByUsername(userId);

        return await blobService.GetBlobUrlAsync(user.CoverImage?.Id + user.CoverImage?.ImageExtension, GlobalConstants.BlobPictures);
    }

    [HttpGet("getUserInformation/{username}")]
    public async Task<UserInformationViewModel> GetUserInformation(string username)
    {
        var user = userService.GetByUsername(username);
        var coverPicture = await blobService.GetBlobUrlAsync(user.CoverImage?.Id + user.CoverImage?.ImageExtension, GlobalConstants.BlobPictures);
        var profilePicture = await blobService.GetBlobUrlAsync(user.ProfileImage?.Id + user.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures);

        var viewModel = new UserInformationViewModel
        {
            CoverImage = coverPicture,
            ProfileImage = profilePicture,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Interests = user.Interests.Select(x => new InterestViewModel { Id = x.Id, Label = x.Name }).ToList(),
            Quote = user.Quote,
        };

        return viewModel;
    }

    [HttpGet("getUserSideInformation/{username}")]
    public async Task<UserInformationViewModel> GetUserSideInformation(string username)
    {
        var user = userService.GetByUsername(username);
        var coverPicture = await blobService.GetBlobUrlAsync(user.CoverImage?.Id + user.CoverImage?.ImageExtension, GlobalConstants.BlobPictures);
        var profilePicture = await blobService.GetBlobUrlAsync(user.ProfileImage?.Id + user.ProfileImage?.ImageExtension, GlobalConstants.BlobPictures);

        var viewModel = new UserInformationViewModel
        {
            CoverImage = coverPicture,
            ProfileImage = profilePicture,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Interests = user.Interests.Select(x => new InterestViewModel { Id = x.Id, Label = x.Name }).ToList(),
            Quote = user.Quote,
        };
            
        return viewModel;
    }

    [HttpPost("FinishFirstTimeSetup")]
    public async Task<IActionResult> FinishFirstTimeSetup([FromForm] FinishFirstTimeSetupRequest dto, IFormFile formFile)
    {
        var user = GetUserByToken();
            
        if (user == null)
        {
            return Unauthorized("You are not logged in!");
        }
            
        var interests = JsonConvert.DeserializeObject<List<InterestDto>>(dto.Interests);

        try
        {
            AuthValidator.ValidateFirstTimeSetup(dto, interests);
        }
        catch (ValidationException ex)
        {
            return BadRequest(ex.Message);
        }

        var allInterests = await interestService.AddNewInterestsAsync(interests);
        var profileImage = await imageService.AddImageAsync(ImageType.ProfileImage);
        var coverImage = await imageService.AddImageAsync(ImageType.ProfileImage);

        await blobService.UploadBase64StringAsync(dto.ProfilePhoto, profileImage.Id+profileImage.ImageExtension, GlobalConstants.BlobPictures);
        await blobService.UploadBase64StringAsync(dto.CoverPhoto, coverImage.Id+coverImage.ImageExtension, GlobalConstants.BlobPictures);

        await userService.SetUserFirstTimeLoginAsync(user, profileImage, coverImage, dto.Quote, allInterests, dto.Longitude, dto.Latitude);

        return Ok("success");
    }

    [HttpPost("getUserImages")]
    public IActionResult GetUserImages(UserImagesRequest dto)
    {
        return Ok(userService.GetUserImages(dto.Username, dto.Take, dto.Skip));
    }

    [HttpPost("getUserData")]
    public async Task<IActionResult> GetUserData()
    {
        var user = GetUserByToken();

        if (user == null)
        {
            return Unauthorized();
        }

        var viewmodel = await userService.GetUserDataAsync(user);

        return Ok(viewmodel);
    }

    [HttpPost("editUserData")]
    public async Task<IActionResult> EditUserData([FromForm] EditUserDataRequest dto)
    {
        var user = GetUserByToken();
        if (user == null || user.Id != dto.UserId)
        {
            return Unauthorized("You are not authorized to make such changes, try logging in!");
        }

        var interests = JsonConvert.DeserializeObject<List<InterestDto>>(dto.Interests);

        try
        {
            AuthValidator.ValidateEditUserData(dto, interests);
        }
        catch (ValidationException ex)
        {
            return BadRequest(ex.Message);
        }

        var allInterests = await interestService.AddNewInterestsAsync(interests);

        await userService.ChangeUserDataAsync(user, dto.FirstName, dto.LastName,
            DateTime.ParseExact(dto.Date, "dd/MM/yyyy", CultureInfo.InvariantCulture, 
                DateTimeStyles.AdjustToUniversal), dto.ChangedProfileImage, 
            dto.ChangedCoverImage, dto.Description, allInterests, dto.Longitude, 
            dto.Latitude, dto.ProfileImage, dto.CoverImage);

        return Ok();
    }

    [HttpPost("forgotPassword")]
    public async Task<IActionResult> SendForgottenPasswordEmail(ForgottenPasswordRequest dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user == null || !(await userManager.IsEmailConfirmedAsync(user)))
        {
            return Ok();
        }

        var code = await userManager.GeneratePasswordResetTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        var callbackUrl = Url.Page(
            "/ResetPassword",
            pageHandler: null,
            values: new { code },
            protocol: Request.Scheme);

        await emailSender.SendEmailAsync(
            GlobalConstants.Email,
            "FriendyFy",
            dto.Email,
            "Reset Password",
            $"Please reset your password by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

        return Ok();
    }

    [HttpPost("resetPassword")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            return BadRequest("There was an error resetting the password!");
        }
            
        var password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        var code = Encoding.UTF8.GetString(Convert.FromBase64String(dto.Code));
            
        if (await userManager.VerifyUserTokenAsync(user, userManager.Options.Tokens.PasswordResetTokenProvider, "ResetPassword", code))
        {
            await userService.ResetPassword(user, password);
        }

        return BadRequest("Something went wrong, try again later!");
    }
}