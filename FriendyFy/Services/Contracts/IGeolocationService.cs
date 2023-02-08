using System.Threading.Tasks;

namespace FriendyFy.Services.Contracts;

public interface IGeolocationService
{
    Task<string> GetUserLocationAsync(double latitude, double longitude);
}