using FriendyFy.Data;
using Microsoft.Rest;

namespace FriendyFy.DataValidation
{
    public static class PostValidator
    {
        public static void ValidateMakePost(MakePostDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Image) && string.IsNullOrWhiteSpace(dto.PostMessage))
            {
                throw new ValidationException("Something went wrong, try again!");
            }
        }
    }
}
