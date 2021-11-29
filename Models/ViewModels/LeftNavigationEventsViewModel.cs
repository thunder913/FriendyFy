using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels.ViewModels
{
    public class LeftNavigationEventsViewModel
    {
        public List<NavigationEventViewModel> AttendingEvents { get; set; } = new List<NavigationEventViewModel>();
        public List<NavigationEventViewModel> SuggestedEvents { get; set; } = new List<NavigationEventViewModel>();
        public List<NavigationEventViewModel> OrganizedEvents { get; set; } = new List<NavigationEventViewModel>();
    }
}
