using FriendyFy.Data.Requests;
using Microsoft.Rest;

namespace FriendyFy.DataValidation;

public static class PostValidator
{
    public static void ValidateMakePost(CreatePostRequest dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Image) && string.IsNullOrWhiteSpace(dto.PostMessage))
        {
            throw new ValidationException("Something went wrong, try again!");
        }
    }
}