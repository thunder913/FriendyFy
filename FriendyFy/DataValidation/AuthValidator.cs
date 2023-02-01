using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Text.RegularExpressions;
using FriendyFy.Data.Dtos;
using FriendyFy.Data.Requests;
using FriendyFy.Models;
using FriendyFy.Models.Enums;

namespace FriendyFy.DataValidation;

public static class AuthValidator
{
    private const string NameRegex = @"^[A-Za-z\u00C0-\u1FFF\u2800-\uFFFD 0-9-]+$";
    private const string NumberRegex = @"\d";
    private const string UpperCaseRegex = @"[A-Z]";
        
    public static void ValidateRegisterUser(RegistrationRequest userDto)
    {
        Regex nameValidator = new Regex(NameRegex);
        TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
        if (userDto.FirstName.Length > 50 || userDto.FirstName.Length < 2 || !nameValidator.IsMatch(userDto.FirstName))
        {
            throw new ValidationException("The first name is invalid!");
        }

        if (userDto.LastName.Length > 50 || userDto.LastName.Length < 2 || !nameValidator.IsMatch(userDto.LastName))
        {
            throw new ValidationException("The last name is invalid!");
        }

        if (!(new EmailAddressAttribute().IsValid(userDto.Email)))
        {
            throw new ValidationException("The email is invalid!");
        }

        if (!DateTime.TryParseExact(userDto.Birthday, "dd/MM/yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out var birthday) ||
            birthday > DateTime.Now ||
            birthday < new DateTime(1900, 1, 1))
        {
            throw new ValidationException("The birthday is invalid!");
        }

        if (!Enum.TryParse(typeof(Gender), textInfo.ToTitleCase(userDto.Gender), out var gender))
        {
            throw new ValidationException("You must select a gender!");
        }

        var passwordNumberRegex = new Regex(NumberRegex);
        var passwordUpperCaseRegex = new Regex(UpperCaseRegex);

        if (!passwordNumberRegex.IsMatch(userDto.Password) ||
            !passwordUpperCaseRegex.IsMatch(userDto.Password) ||
            userDto.Password.Length < 8)
        {
            throw new ValidationException("The password is invalid!");
        }

        if (!Enum.TryParse(textInfo.ToTitleCase(userDto.Theme), out ThemePreference _))
        {
            throw new ValidationException("You must select a theme!");
        }
    }

    public static void ValidateLoginUser(LoginRequest userDto, ApplicationUser user)
    {
        if (user == null ||
            !BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash))
        {
            throw new ValidationException("Invalid credentials!");
        }

        if (!user.EmailConfirmed)
        {
            throw new ValidationException("The email is not confirmed!");
        }
    }

    public static void ValidateConfirmEmail(ConfirmEmailRequest confirmeEmailDto)
    {
        if (confirmeEmailDto.UserId == null || confirmeEmailDto.Code == null)
        {
            throw new ValidationException("Invalid credentials!");
        }
    }

    public static void ValidateUserEmailConfirmed(ApplicationUser? applicationUser)
    {
        if (applicationUser == null)
        {
            throw new ValidationException($"Unable to load user with the given id.");
        }
            
        if (applicationUser.EmailConfirmed)
        {
            throw new ValidationException("Email is already confirmed!");
        }
    }

    public static void ValidateFirstTimeSetup(FinishFirstTimeSetupRequest setupDto, List<InterestDto> interests)
    {
        if (string.IsNullOrWhiteSpace(setupDto.Quote))
        {
            throw new ValidationException("You must enter a description/quote!");
        }

        if (setupDto.Latitude == null || setupDto.Longitude == null)
        {
            throw new ValidationException("The location is invalid!");
        }

        if (interests.Count < 3)
        {
            throw new ValidationException("You must select at least 3 interests!");
        }
    }

    public static void ValidateEditUserData(EditUserDataRequest dto, List<InterestDto> interests)
    {
        Regex nameValidator = new Regex(NameRegex);



        if (dto.FirstName.Length > 50 || dto.FirstName.Length < 2 || !nameValidator.IsMatch(dto.FirstName))
        {
            throw new ValidationException("The first name is invalid!");
        }
        if (dto.LastName.Length > 50 || dto.LastName.Length < 2 || !nameValidator.IsMatch(dto.LastName))
        {
            throw new ValidationException("The last name is invalid!");
        }
        if (!DateTime.TryParseExact(dto.Date, "dd/MM/yyyy",
                CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out var birthday) ||
            birthday > DateTime.Now ||
            birthday < new DateTime(1900, 1, 1))
        {
            throw new ValidationException("The birthday is invalid!");
        }

        if (interests.Count < 3)
        {
            throw new ValidationException("You must select at least 3 interests!");
        }

        if (string.IsNullOrWhiteSpace(dto.Description))
        {
            throw new ValidationException("You must enter a description/quote!");
        }

        if (dto.Latitude == null || dto.Longitude == null)
        {
            throw new ValidationException("You must choose a location!");
        }
    }
}