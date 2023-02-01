using FriendyFy.Data;
using FriendyFy.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using FriendyFy.Models.Enums;

namespace FriendyFy.DataValidation;

public static class EventValidator
{
    public static void ValidateCreateEvent(CreateEventDto eventDto, List<InterestDto> interests)
    {
        var privacySettingsParsed = Enum.TryParse(eventDto.PrivacyOptions, out PrivacySettings _);
        var dateParsed = DateTime.TryParseExact(eventDto.Date, "dd/MM/yyyy HH:mm",
            CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out var date);
            
        if (eventDto.Name.Length < 2)
        {
            throw new ValidationException("Event name must be at least 2 characters long!");
        }

        if (!dateParsed ||
            date <= DateTime.Now)
        {
            throw new ValidationException("The event date is invalid!");
        }

        if (interests.Count == 0)
        {
            throw new ValidationException("You must select at least one interest!");
        }

        if (eventDto.Latitude == null || eventDto.Longitude == null)
        {
            throw new ValidationException("You must select a location!");
        }

        if (string.IsNullOrWhiteSpace(eventDto.Description))
        {
            throw new ValidationException("You must enter a description!");
        }

        if (!privacySettingsParsed)
        {
            throw new ValidationException("Privacy settings are invalid!");
        }

        if (string.IsNullOrWhiteSpace(eventDto.Image))
        {
            throw new ValidationException("You must select an image!");
        }

        if (interests.Count > 6)
        {
            throw new ValidationException("You can select up to 6 interests!");
        }
    }
}