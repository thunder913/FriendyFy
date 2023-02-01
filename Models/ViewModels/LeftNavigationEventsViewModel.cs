using System.Collections.Generic;

namespace ViewModels.ViewModels;

public class LeftNavigationEventsViewModel
{
    public List<NavigationEventViewModel> AttendingEvents { get; set; } = new List<NavigationEventViewModel>();
    public List<NavigationEventViewModel> SuggestedEvents { get; set; } = new List<NavigationEventViewModel>();
    public List<NavigationEventViewModel> OrganizedEvents { get; set; } = new List<NavigationEventViewModel>();
}