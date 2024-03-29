﻿using System.Collections.Generic;

namespace FriendyFy.Data.Requests;

public class CreatePostRequest
{
    public string PrivacySettings { get; set; }
    public string PostMessage { get; set; }
    public decimal? LocationLat { get; set; }
    public decimal? LocationLng { get; set; }
    public string Image { get; set; }
    public List<string> People { get; set; }
}