using AutoMapper.Configuration.Annotations;

namespace ViewModels;

public class UserViewModel
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    [Ignore]
    public string ProfilePhoto { get; set; }
    [Ignore]
    public string CoverPhoto { get; set; }
    public string UserName { get; set; }
    public string Id { get; set; }
    public bool FinishedFirstTimeLogin { get; set; }
    public bool IsDark { get; set; }
}