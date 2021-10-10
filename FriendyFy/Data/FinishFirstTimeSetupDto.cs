using System.Collections.Generic;

namespace FriendyFy.Data
{
    public class FinishFirstTimeSetupDto
    {
        public FileModel ProfilePhoto { get; set; }
        public FileModel CoverPhoto { get; set; }
        public string Quote { get; set; }
        public ICollection<InterestDto> Interests { get; set; } = new List<InterestDto>();
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
