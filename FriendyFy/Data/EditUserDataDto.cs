namespace FriendyFy.Data
{
    public class EditUserDataDto
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Date { get; set; }
        public string ProfileImage { get; set; }
        public bool ChangedProfileImage { get; set; }
        public string CoverImage { get; set; }
        public bool ChangedCoverImage { get; set; }
        public string Interests { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string Description { get; set; }
    }
}
