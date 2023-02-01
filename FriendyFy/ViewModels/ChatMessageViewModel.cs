using System;

namespace FriendyFy.ViewModels;

public class ChatMessageViewModel
{
    public string MessageId { get; set; }
    public DateTime Date { get; set; }
    public bool IsYourMessage { get; set; }
    public string Message { get; set; }
    public string Name{ get; set; }
    public string Photo { get; set; }
    public string Username { get; set; }
}