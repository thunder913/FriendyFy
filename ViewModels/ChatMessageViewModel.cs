using System;

namespace ViewModels
{
    public class ChatMessageViewModel
    {
        public DateTime Date { get; set; }
        public bool IsYourMessage { get; set; }
        public string Message { get; set; }
        public string Name{ get; set; }
        public string Photo { get; set; }
    }
}
