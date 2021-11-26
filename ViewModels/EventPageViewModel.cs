﻿using System;
using System.Collections.Generic;

namespace ViewModels
{
    public class EventPageViewModel
    {
        public string Id { get; set; }
        public List<string> Photos { get; set; } = new List<string>();
        public List<string> MainPhoto { get; set; } = new List<string>();
        public List<string> UserImages { get; set; } = new List<string>();
        public decimal? Lat { get; set; }
        public decimal? Lng { get; set; }
        public string City { get; set; }
        public DateTime Time { get; set; }
        public string Title { get; set; }
        public string Privacy { get; set; }
        public bool IsReocurring { get; set; }
        public string ReocurringTime { get; set; }
        public List<InterestViewModel> Interests { get; set; } = new List<InterestViewModel>();
        public string Organizer { get; set; }
        public string OrganizerUsername { get; set; }
        public bool IsInEvent { get; set; }
        public string Description { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
