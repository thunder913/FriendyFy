using System;
using System.Collections.Generic;
using FriendyFy.ViewModels;

namespace FriendyFy.Data.Dtos
{
    public class EventDto
    {
        public IEnumerable<InterestViewModel> Interests { get; set; }
        public string Id { get; set; }
        public string Location { get; set; }
        public string Name { get; set; }
        public DateTime Time { get; set; }
        public IEnumerable<string> GoingPhotosNames { get; set; }
        public string OrganizerImageName { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
}
}
