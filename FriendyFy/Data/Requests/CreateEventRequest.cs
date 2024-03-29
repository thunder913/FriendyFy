﻿namespace FriendyFy.Data.Requests;

public class CreateEventRequest
{
    public string Name { get; set; }
    public string Date { get; set; }
    public string Interests { get; set; }
    public string PrivacyOptions { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string Description { get; set; }
    public string Image { get; set; }
}