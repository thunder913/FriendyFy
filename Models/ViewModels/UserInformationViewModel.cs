using System.Collections.Generic;

namespace ViewModels;

public class UserInformationViewModel
{
    public string ProfileImage { get; set; }
    public string CoverImage { get; set; }
    public string Quote { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public List<InterestViewModel> Interests { get; set; } = new List<InterestViewModel>();
}