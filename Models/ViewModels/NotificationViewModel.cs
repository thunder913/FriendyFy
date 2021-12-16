using System;

namespace ViewModels.ViewModels
{
    public class NotificationViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Image { get; set; }
        public string EventName { get; set; }
        public string InviterUsername { get; set; }
        public DateTime? Date { get; set; }
        public string EventId { get; set; }
        public bool IsAvailable { get; set; }
    }
}
