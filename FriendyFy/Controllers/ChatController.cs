﻿using System.Collections.Generic;
using System.Threading.Tasks;
using FriendyFy.Common;
using FriendyFy.Data.Requests;
using FriendyFy.Services.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace FriendyFy.Controllers;

[Route("chat")]
[ApiController]
public class ChatController : BaseController
{
    private readonly IChatService chatService;
    public ChatController(IChatService chatService)
    {
        this.chatService = chatService;
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetUserChats([FromQuery] UserChatsRequest dto)
    {
        var user = await GetUserByToken();
            
        if (user == null || user.UserName != dto.Username)
        {
            return Unauthorized(GlobalConstants.NotSignedInMessage);
        }
            
        var chatIds = new List<string>();
        if (!string.IsNullOrWhiteSpace(dto.ChatIds))
        {
            chatIds = JsonConvert.DeserializeObject<List<string>>(dto.ChatIds);
        }

        return Ok(await chatService.GetUserChatsAsync(dto.Username, dto.Page, dto.ItemsPerPage, dto.Take, dto.Search, chatIds));
    }

    [HttpGet("user")]
    public async Task<IActionResult> GetUserChat([FromQuery] ChatRequest dto)
    {
        var user = await GetUserByToken();

        if (user == null || user.UserName != dto.Username)
        {
            return Unauthorized(GlobalConstants.NotSignedInMessage);
        }

        var chat = await chatService.GetChatMessagesAsync(user.Id, dto.ChatId, dto.Take, dto.Skip);

        return Ok(chat);
    }

    [HttpPost("see")]
    public async Task<IActionResult> SeenMessage([FromBody] ChatRequest dto)
    {
        var user = await GetUserByToken();

        if (user == null)
        {
            return Unauthorized(GlobalConstants.NotSignedInMessage);
        }

        return Ok(await chatService.SeeMessagesAsync(dto.ChatId, user));
    }
}