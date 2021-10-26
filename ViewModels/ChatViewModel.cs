using System.Collections.Generic;

namespace ViewModels
{
    public class ChatViewModel
    {
        public string Image { get; set; }
        public string Name { get; set; }
        public ICollection<ChatMessageViewModel> Messages { get; set; } = new List<ChatMessageViewModel>();
    }
}
