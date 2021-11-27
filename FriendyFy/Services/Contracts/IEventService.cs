﻿using FriendyFy.Models;
using FriendyFy.Models.Enums;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ViewModels;

namespace FriendyFy.Services.Contracts
{
    public interface IEventService
    {
        Task CreateEventAsync(string name, DateTime date, List<Interest> interests, PrivacySettings privacySettings, decimal latitude, decimal longitude, bool isReocurring, ReocurringType reocurringType, string description, string organizerId);
        Task<EventPageViewModel> GetEventByIdAsync(string id, string userId);
    }
}