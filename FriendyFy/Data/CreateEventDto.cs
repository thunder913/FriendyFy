namespace FriendyFy.Data
{
    public class CreateEventDto
    {
        public string Name { get; set; }
        public string Date { get; set; }
        public string Interests { get; set; }
        public string PrivacyOptions { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public bool IsReocurring { get; set; }
        public string ReocurringFrequency { get; set; }
        public string Description { get; set; }
    }
}
