using System;
using System.Collections.Generic;

namespace ViewModels.ViewModels
{
    public class NavigationEventViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public DateTime Time { get; set; }
        public List<InterestViewModel> Interests { get; set; } = new List<InterestViewModel>();
        public List<string> GoingPhotos { get; set; } = new List<string>();
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }
}
