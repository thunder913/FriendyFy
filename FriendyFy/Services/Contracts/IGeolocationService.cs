namespace FriendyFy.Services.Contracts
{
    public interface IGeolocationService
    {
        public string GetUserLocation(double latitude, double longiitude);
    }
}
