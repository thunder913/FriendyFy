using System.Collections.Generic;

namespace FriendyFy.ViewModels;

public class LeftNavigationEventsViewModel
{
    public List<NavigationEventViewModel> AttendingEvents { get; set; } = new();
    public List<NavigationEventViewModel> SuggestedEvents { get; set; } = new();
    public List<NavigationEventViewModel> OrganizedEvents { get; set; } = new();
}